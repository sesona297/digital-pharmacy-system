
import React from 'react';
import { label } from '../../utils/adminFormatters';

export default function ReportsPanel({
                                         orders,
                                         users,
                                         inventory,
                                         lowStock
                                     }) {
    const orderStatuses = [
        'PENDING',
        'PROCESSING',
        'PACKED',
        'SHIPPED',
        'DELIVERED',
        'READY_FOR_COLLECTION',
        'COLLECTED',
        'CANCELLED'
    ];

    const roles = [
        'Customer',
        'Pharmacist',
        'Courier',
        'Admin'
    ];

    const aboveReorder = Math.max(
        inventory.length - lowStock,
        0
    );

    const stockHealth = Math.round(
        aboveReorder / Math.max(inventory.length, 1) * 100
    );

    return (
        <section className="ad-report-grid">
            <article className="ad-panel">
                <h2>Order fulfilment</h2>
                <p className="ad-muted">
                    Current order distribution
                </p>

                {orderStatuses.map(status => {
                    const count = orders.filter(
                        order => order.status === status
                    ).length;

                    const percentage = orders.length
                        ? count / orders.length * 100
                        : 0;

                    return (
                        <div className="ad-bar-row" key={status}>
                            <span>{label(status)}</span>

                            <div>
                                <i style={{ width: `${percentage}%` }} />
                            </div>

                            <b>{count}</b>
                        </div>
                    );
                })}
            </article>

            <article className="ad-panel">
                <h2>User roles</h2>
                <p className="ad-muted">
                    Accounts by assigned role
                </p>

                {roles.map(role => {
                    const count = users.filter(
                        user => user.role.toLowerCase() === role.toLowerCase()
                    ).length;

                    const percentage = users.length
                        ? count / users.length * 100
                        : 0;

                    return (
                        <div className="ad-bar-row" key={role}>
                            <span>{role}</span>

                            <div>
                                <i style={{ width: `${percentage}%` }} />
                            </div>

                            <b>{count}</b>
                        </div>
                    );
                })}
            </article>

            <article className="ad-panel">
                <h2>Stock health</h2>

                <p className="ad-muted">
                    {aboveReorder} products currently above reorder level.
                </p>

                <div className="ad-report-number">
                    {stockHealth}%
                </div>

                <p className="ad-muted">
                    Above reorder threshold
                </p>
            </article>
        </section>
    );
}
