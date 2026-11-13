
import React from 'react';
import OrderTable from './OrderTable';
import { badge, label } from '../../utils/adminFormatters';

export default function OrdersDeliveries({
                                             deliveries,
                                             orders,
                                             users,
                                             couriers,
                                             courierChoices,
                                             setCourierChoices,
                                             deliveryLoading,
                                             assigningDelivery,
                                             busyOrder,
                                             onAssignCourier,
                                             onUpdateOrder
                                         }) {
    return (
        <>
            <section className="ad-panel">
                <div className="ad-panel-head">
                    <div>
                        <h2>Courier assignment</h2>
                        <p>
                            Assign packed delivery orders to a registered courier.
                            Packing remains a pharmacist-only action.
                        </p>
                    </div>
                </div>

                {deliveryLoading ? (
                    <div className="ad-empty">
                        Loading deliveries…
                    </div>
                ) : (
                    <div className="ad-table-wrap">
                        <table className="ad-table">
                            <thead>
                            <tr>
                                <th>Delivery</th>
                                <th>Order</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th>Assigned courier</th>
                                <th>Assign</th>
                            </tr>
                            </thead>

                            <tbody>
                            {deliveries.map(delivery => {
                                const id = delivery.id ?? delivery.deliveryId;

                                const status = String(
                                    delivery.status ||
                                    delivery.deliveryStatus ||
                                    ''
                                ).toUpperCase();

                                const assigned =
                                    delivery.courierId ?? delivery.courier?.id;

                                const eligible = [
                                    'PACKED',
                                    'PENDING',
                                    'READY_FOR_DELIVERY',
                                    'AWAITING_COURIER'
                                ].includes(status);

                                return (
                                    <tr key={id}>
                                        <td>
                                            <strong>{id ?? '—'}</strong>
                                        </td>

                                        <td>
                                            {delivery.order?.orderNumber ??
                                                delivery.orderNumber ??
                                                delivery.orderId ??
                                                '—'}
                                        </td>

                                        <td style={{ whiteSpace: 'normal', minWidth: 180 }}>
                                            {delivery.address ||
                                                delivery.deliveryAddress ||
                                                delivery.streetAddress ||
                                                'Address not supplied'}
                                        </td>

                                        <td>
                        <span className={`ad-badge ${badge(status)}`}>
                          {label(status)}
                        </span>
                                        </td>

                                        <td>
                                            {assigned
                                                ? (
                                                    users.find(
                                                        user =>
                                                            String(user.id) === String(assigned)
                                                    )?.name || `Courier #${assigned}`
                                                )
                                                : 'Unassigned'}
                                        </td>

                                        <td>
                                            <div className="ad-action-group">
                                                <select
                                                    aria-label={`Choose courier for delivery ${id}`}
                                                    value={courierChoices[String(id)] || ''}
                                                    onChange={event =>
                                                        setCourierChoices(previous => ({
                                                            ...previous,
                                                            [String(id)]: event.target.value
                                                        }))
                                                    }
                                                    disabled={!eligible || Boolean(assigned)}
                                                >
                                                    <option value="">
                                                        Choose courier
                                                    </option>

                                                    {couriers.map(courier => (
                                                        <option
                                                            key={courier.id}
                                                            value={courier.id}
                                                        >
                                                            {courier.name} · #{courier.id}
                                                        </option>
                                                    ))}
                                                </select>

                                                <button
                                                    className="ad-btn ad-small"
                                                    disabled={
                                                        !eligible ||
                                                        Boolean(assigned) ||
                                                        !courierChoices[String(id)] ||
                                                        assigningDelivery === String(id)
                                                    }
                                                    onClick={() => onAssignCourier(delivery)}
                                                >
                                                    {assigningDelivery === String(id)
                                                        ? 'Assigning…'
                                                        : 'Assign delivery'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>

                        {!deliveries.length && (
                            <div className="ad-empty">
                                No delivery records returned by the backend.
                                Check GET /delivery/getall.
                            </div>
                        )}
                    </div>
                )}

                {couriers.length === 0 && (
                    <p className="ad-footnote">
                        No courier accounts were returned by the users endpoint.
                    </p>
                )}
            </section>

            <section className="ad-panel">
                <div className="ad-panel-head">
                    <div>
                        <h2>Orders</h2>
                        <p>
                            Admin order actions exclude packing; pharmacists pack orders.
                        </p>
                    </div>
                </div>

                <OrderTable
                    orders={orders}
                    updateOrder={onUpdateOrder}
                    busyOrder={busyOrder}
                />
            </section>
        </>
    );
}
