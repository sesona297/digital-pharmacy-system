
import React, { useMemo, useState } from 'react';

export default function UserManagement({
                                           users,
                                           loading,
                                           onSuspend,
                                           onReactivate,
                                           busyAccountId
                                       }) {
    const [query, setQuery] = useState('');

    const customers = useMemo(
        () => users.filter(user => user.role === 'Customer'),
        [users]
    );

    const filteredCustomers = useMemo(() => {
        const search = query.trim().toLowerCase();

        return customers.filter(customer =>
            `${customer.id} ${customer.name} ${customer.email}`
                .toLowerCase()
                .includes(search)
        );
    }, [customers, query]);

    function handleStatusChange(customer) {
        const suspended = customer.accountStatus === 'SUSPENDED';

        const action = suspended ? 'reactivate' : 'suspend';
        const confirmed = window.confirm(
            `Are you sure you want to ${action} ${customer.name}'s account?`
        );

        if (!confirmed) return;

        if (suspended) {
            onReactivate?.(customer);
        } else {
            onSuspend?.(customer);
        }
    }

    function statusClass(status) {
        return status === 'ACTIVE' ? 'green' : 'red';
    }

    return (
        <section className="ad-panel">
            <div className="ad-panel-head">
                <div>
                    <h2>Customer accounts</h2>
                    <p>
                        View and manage registered customer accounts.
                    </p>
                </div>

                <span className="ad-badge blue">
                    {customers.length} customers
                </span>
            </div>

            <div className="ad-toolbar">
                <input
                    type="search"
                    placeholder="Search customer name, email, ID…"
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                />
            </div>

            <div className="ad-table-wrap">
                <table className="ad-table">
                    <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Account status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredCustomers.map(customer => {
                        const suspended =
                            customer.accountStatus === 'SUSPENDED';

                        const busy =
                            String(busyAccountId) === String(customer.id);

                        return (
                            <tr key={customer.id}>
                                <td>
                                    <strong>{customer.name}</strong>
                                    <small>{customer.id}</small>
                                </td>

                                <td>{customer.email || '—'}</td>
                                <td>Customer</td>

                                <td>
                                        <span
                                            className={`ad-badge ${statusClass(customer.accountStatus)}`}
                                        >
                                            {customer.status}
                                        </span>
                                </td>

                                <td>
                                    <button
                                        type="button"
                                        className={`ad-btn ${suspended ? '' : 'ad-ghost'}`}
                                        disabled={busy}
                                        onClick={() =>
                                            handleStatusChange(customer)
                                        }
                                    >
                                        {busy
                                            ? 'Updating…'
                                            : suspended
                                                ? 'Reactivate'
                                                : 'Suspend'}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {!filteredCustomers.length && (
                    <div className="ad-empty">
                        {loading
                            ? 'Loading customers…'
                            : customers.length
                                ? 'No customers match this search.'
                                : 'No customer accounts returned by the backend.'}
                    </div>
                )}
            </div>
        </section>
    );
}
