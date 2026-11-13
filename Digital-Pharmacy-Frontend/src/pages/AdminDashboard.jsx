
import React, { useCallback, useEffect, useState } from 'react';
import '../styles/admin.css';
import InventoryPanel from '../components/InventoryPanel';
import useInventory from '../hooks/useInventory';
import api, { getStoredUser } from '../services/api';

import OverviewPanel from '../components/admin/OverviewPanel';
import UserManagement from '../components/admin/UserManagement';
import StaffManagement from '../components/admin/StaffManagement';
import StaffFormModal from '../components/admin/StaffFormModal';
import OrdersDeliveries from '../components/admin/OrdersDeliveries';
import AuditLog from '../components/admin/AuditLog';
import ReportsPanel from '../components/admin/ReportsPanel';

import {
  normaliseUser,
  normaliseOrder,
  label
} from '../utils/adminFormatters';

const navItems = [
  ['Overview', '▦'],
  ['User Management', '♙'],
  ['Staff Management', '♟'],
  ['Inventory', '▤'],
  ['Orders & Deliveries', '↗'],
  ['Audit Log', '≡'],
  ['Reports', '▥']
];

const emptyStaffForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  role: 'PHARMACIST'
};

export default function AdminDashboard({ onExit }) {
  const [tab, setTab] = useState('Overview');

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [audit, setAudit] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [busyOrder, setBusyOrder] = useState('');
  const [assigningDelivery, setAssigningDelivery] = useState('');
  const [courierChoices, setCourierChoices] = useState({});

  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffFormMode, setStaffFormMode] = useState('create');
  const [creatingStaff, setCreatingStaff] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [busyAccountId, setBusyAccountId] = useState(null);

  const [staffForm, setStaffForm] = useState(emptyStaffForm);
  const [staffError, setStaffError] = useState('');

  const {
    inventory,
    categories,
    loading: inventoryLoading,
    error: inventoryError,
    reload: reloadInventory
  } = useInventory();

  const currentUser = getStoredUser();

  const notify = text => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setDeliveryLoading(true);
    setError('');

    const results = await Promise.allSettled([
      api.get('/user/getAll'),
      api.get('/order/getall'),
      api.get('/auditlog/getall'),
      api.get('/delivery/getall')
    ]);

    const [
      userResult,
      orderResult,
      auditResult,
      deliveryResult
    ] = results;

    const failures = [];

    if (userResult.status === 'fulfilled') {
      setUsers(
          (Array.isArray(userResult.value)
                  ? userResult.value
                  : []
          ).map(normaliseUser)
      );
    } else {
      failures.push(
          `users: ${userResult.reason?.message || 'failed'}`
      );
    }

    if (orderResult.status === 'fulfilled') {
      setOrders(
          (Array.isArray(orderResult.value)
                  ? orderResult.value
                  : []
          ).map(normaliseOrder)
      );
    } else {
      failures.push(
          `orders: ${orderResult.reason?.message || 'failed'}`
      );
    }

    if (auditResult.status === 'fulfilled') {
      setAudit(
          Array.isArray(auditResult.value)
              ? auditResult.value
              : []
      );
    } else {
      failures.push(
          `audit log: ${auditResult.reason?.message || 'failed'}`
      );
    }

    if (deliveryResult.status === 'fulfilled') {
      setDeliveries(
          Array.isArray(deliveryResult.value)
              ? deliveryResult.value
              : []
      );
    } else {
      failures.push(
          `deliveries: ${deliveryResult.reason?.message || 'failed'}`
      );
    }

    if (failures.length) {
      setError(
          `Some administrator data could not be loaded (${failures.join('; ')}). Check permissions and retry.`
      );
    }

    setLoading(false);
    setDeliveryLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeInventory = inventory.filter(
      product => product.active !== false
  );

  const lowStock = activeInventory.filter(
      product => product.stock <= product.reorder
  ).length;

  const deliveredOrders = orders.filter(order =>
      ['DELIVERED', 'COLLECTED'].includes(order.status)
  );

  const activeOrders = orders.filter(order =>
      !['DELIVERED', 'COLLECTED', 'CANCELLED'].includes(order.status)
  );

    const couriers = users.filter(user =>
        user.role?.toLowerCase() === 'courier' &&
        user.accountStatus === 'ACTIVE'
    );

  async function createStaff(event) {
    event.preventDefault();
    setStaffError('');

    const email = staffForm.email.trim();

    if (!/^[A-Za-z0-9._%+-]+@pharmaflow\.com$/i.test(email)) {
      setStaffError(
          'Invalid email. Staff accounts must use an @pharmaflow.com address.'
      );
      return;
    }

    setCreatingStaff(true);
    setError('');
    setNotice('');

    try {
      await api.post('/user/create-staff', {
        ...staffForm,
        email
      });

      setNotice(
          `${label(staffForm.role)} account created successfully.`
      );

      setStaffForm(emptyStaffForm);
      setShowStaffForm(false);

      await load();
    } catch (err) {
      setStaffError(
          err.response?.data?.message ||
          err.message ||
          'Could not create the staff account.'
      );
    } finally {
      setCreatingStaff(false);
    }
  }

  async function editStaff(event) {
    event.preventDefault();
    setStaffError('');

    if (!editingStaffId) {
      setStaffError('No staff account was selected.');
      return;
    }

    const fullName = staffForm.fullName.trim();

    if (!fullName) {
      setStaffError('Full name is required.');
      return;
    }

    setCreatingStaff(true);
    setError('');

    try {
      await api.put(
          `/user/${encodeURIComponent(String(editingStaffId))}/staff-details`,
          {
            fullName,
            phone: staffForm.phone.trim()
          }
      );

      setShowStaffForm(false);
      setEditingStaffId(null);
      setStaffForm(emptyStaffForm);

      notify('Staff details updated successfully.');
      await load();
    } catch (err) {
      setStaffError(
          err.response?.data?.message ||
          err.message ||
          'Could not update the staff details.'
      );
    } finally {
      setCreatingStaff(false);
    }
  }

  async function changeAccountStatus(user, action) {
    if (!user?.id) {
      setError('The selected account does not have a valid ID.');
      return;
    }

    setBusyAccountId(user.id);
    setError('');

    try {
      await api.patch(
          `/user/${encodeURIComponent(String(user.id))}/${action}`
      );

      notify(
          `${user.name}'s account ${action === 'suspend' ? 'suspended' : 'reactivated'} successfully.`
      );

      await load();
    } catch (err) {
      setError(
          err.response?.data?.message ||
          err.message ||
          `Could not ${action} this account. Check the backend permissions and endpoint.`
      );
    } finally {
      setBusyAccountId(null);
    }
  }

  function suspendAccount(user) {
    return changeAccountStatus(user, 'suspend');
  }

  function reactivateAccount(user) {
    return changeAccountStatus(user, 'reactivate');
  }

    async function assignCourier(delivery) {
        const deliveryId = delivery.id ?? delivery.deliveryId;
        const courierId = courierChoices[String(deliveryId)];

        if (!deliveryId || !courierId) {
            setError('Choose a courier before assigning this delivery.');
            return;
        }

        const selectedCourier = couriers.find(
            courier => String(courier.id) === String(courierId)
        );

        if (!selectedCourier) {
            setError(
                'This courier is unavailable or their account is suspended. Select an active courier.'
            );
            setCourierChoices(current => ({
                ...current,
                [String(deliveryId)]: ''
            }));
            return;
        }

        setAssigningDelivery(String(deliveryId));
        setError('');

        try {
            await api.put(
                `/delivery/${encodeURIComponent(String(deliveryId))}/courier/${encodeURIComponent(String(courierId))}`,
                {}
            );

            notify(
                `Delivery ${deliveryId} assigned to ${selectedCourier.name || selectedCourier.fullName || `courier ${courierId}`}.`
            );

            await load();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Could not assign this delivery. Check the backend permissions and endpoint.'
            );
        } finally {
            setAssigningDelivery('');
        }
    }

  async function updateOrder(order, action) {
    setBusyOrder(order.id);
    setError('');

    try {
      await api.post(
          `/order/${encodeURIComponent(order.id)}/${action}`
      );

      notify(`Order ${order.id} updated successfully.`);
      await load();
    } catch (err) {
      setError(err.message || 'Could not update this order.');
    } finally {
      setBusyOrder('');
    }
  }

  function openStaffForm() {
    setError('');
    setStaffError('');
    setStaffFormMode('create');
    setEditingStaffId(null);
    setStaffForm(emptyStaffForm);
    setShowStaffForm(true);
  }

  function openStaffEdit(member) {
    setError('');
    setStaffError('');
    setStaffFormMode('edit');
    setEditingStaffId(member.id);

    setStaffForm({
      fullName: member.fullName || member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      password: '',
      role: member.role === 'Pharmacist'
          ? 'PHARMACIST'
          : 'COURIER'
    });

    setShowStaffForm(true);
  }

  function closeStaffForm() {
    if (creatingStaff) return;

    setShowStaffForm(false);
    setEditingStaffId(null);
    setStaffForm(emptyStaffForm);
    setStaffError('');
  }

  function submitStaffForm(event) {
    if (staffFormMode === 'edit') {
      return editStaff(event);
    }

    return createStaff(event);
  }

  return (
      <div className="ad-app">
        <header className="ad-topbar">
          <button className="ad-brand" onClick={onExit}>
            <span className="ad-mark">✚</span>
            <span>
                        PharmaFlow
                        <small>Administration</small>
                    </span>
          </button>

          <div className="ad-top-right">
                    <span className="ad-secure">
                        🔒 {currentUser?.fullName || 'Administrator'}
                    </span>

            <button
                className="ad-btn ad-ghost"
                onClick={onExit}
            >
              Exit workspace
            </button>
          </div>
        </header>

        <div className="ad-layout">
          <aside className="ad-sidebar">
            <div className="ad-side-label">ADMINISTRATION</div>

            {navItems.map(([name, icon]) => (
                <button
                    key={name}
                    className={`ad-nav ${tab === name ? 'active' : ''}`}
                    onClick={() => setTab(name)}
                >
                  <span>{icon}</span>
                  {name}

                  {name === 'Inventory' && lowStock > 0 && (
                      <b>{lowStock}</b>
                  )}
                </button>
            ))}

            <div className="ad-side-note">
              <strong>Security reminder</strong>
              <p>
                Use least-privilege access. Review unusual activity
                and avoid exposing patient information unnecessarily.
              </p>
            </div>
          </aside>

          <main className="ad-main">
            <div className="ad-page-head">
              <div>
                <div className="ad-eyebrow">
                  PHARMAFLOW · SYSTEM CONTROL
                </div>

                <h1>
                  {tab === 'Overview'
                      ? 'Administration overview'
                      : tab}
                </h1>

                <p>
                  Monitor pharmacy operations, manage access,
                  and review system activity.
                </p>
              </div>

              <button
                  className="ad-btn ad-ghost"
                  onClick={load}
                  disabled={loading}
              >
                {loading ? 'Refreshing…' : 'Refresh data'}
              </button>
            </div>

            {notice && (
                <div className="ad-notice" role="status">
                  {notice}
                </div>
            )}

            {error && (
                <div className="ad-notice" role="alert">
                  {error}
                  <button
                      className="ad-link"
                      onClick={load}
                  >
                    Retry
                  </button>
                </div>
            )}

            {tab === 'Overview' && (
                <OverviewPanel
                    users={users}
                    orders={orders}
                    audit={audit}
                    inventory={activeInventory}
                    lowStock={lowStock}
                    activeOrders={activeOrders}
                    deliveredOrders={deliveredOrders}
                    loading={loading}
                    inventoryLoading={inventoryLoading}
                    busyOrder={busyOrder}
                    updateOrder={updateOrder}
                    onNavigate={setTab}
                />
            )}

            {tab === 'User Management' && (
                <UserManagement
                    users={users}
                    loading={loading}
                    onSuspend={suspendAccount}
                    onReactivate={reactivateAccount}
                    busyAccountId={busyAccountId}
                />
            )}

            {tab === 'Staff Management' && (
                <StaffManagement
                    users={users}
                    loading={loading}
                    onCreateStaff={openStaffForm}
                    onEditStaff={openStaffEdit}
                    onSuspend={suspendAccount}
                    onReactivate={reactivateAccount}
                    busyAccountId={busyAccountId}
                />
            )}

            {tab === 'Inventory' && (
                <InventoryPanel
                    inventory={inventory}
                    categories={categories}
                    loading={inventoryLoading}
                    error={inventoryError}
                    onReload={reloadInventory}
                    notify={notify}
                    money={value =>
                        `R ${Number(value || 0).toFixed(2)}`
                    }
                />
            )}

            {tab === 'Orders & Deliveries' && (
                <OrdersDeliveries
                    deliveries={deliveries}
                    orders={orders}
                    users={users}
                    couriers={couriers}
                    courierChoices={courierChoices}
                    setCourierChoices={setCourierChoices}
                    deliveryLoading={deliveryLoading}
                    assigningDelivery={assigningDelivery}
                    busyOrder={busyOrder}
                    onAssignCourier={assignCourier}
                    onUpdateOrder={updateOrder}
                />
            )}

            {tab === 'Audit Log' && (
                <AuditLog
                    audit={audit}
                    loading={loading}
                />
            )}

            {tab === 'Reports' && (
                <ReportsPanel
                    orders={orders}
                    users={users}
                    inventory={activeInventory}
                    lowStock={lowStock}
                />
            )}
          </main>
        </div>

        {showStaffForm && (
            <StaffFormModal
                mode={staffFormMode}
                staffForm={staffForm}
                setStaffForm={setStaffForm}
                staffError={staffError}
                creatingStaff={creatingStaff}
                onSubmit={submitStaffForm}
                onClose={closeStaffForm}
            />
        )}
      </div>
  );
}
