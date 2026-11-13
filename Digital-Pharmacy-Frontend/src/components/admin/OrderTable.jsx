
import React from 'react';
import {
    money,
    label,
    badge,
    dateTime
} from '../../utils/adminFormatters';

export default function OrderTable({
                                       orders,
                                       updateOrder,
                                       busyOrder,
                                       compact = false
                                   }) {
    const shown = compact ? orders.slice(0, 5) : orders;

    return (
        <div className="ad-table-wrap">
            <table className="ad-table">
                <thead>
                <tr>
                    <th>Order</th>
                    <th>Customer ID</th>
                    <th>Total</th>
                    <th>Order status</th>
                    <th>Payment</th>
                    <th>Available actions</th>
                </tr>
                </thead>

                <tbody>
                {shown.map(order => {
                    const busy = busyOrder === order.id;
                    const actions = [];

                    if (
                        order.status === 'PENDING' &&
                        order.paymentStatus === 'PENDING'
                    ) {
                        actions.push(['pay', 'Mark paid']);
                    }

                    if (
                        order.status === 'READY_FOR_COLLECTION' &&
                        order.type === 'CLICK_AND_COLLECT'
                    ) {
                        actions.push(['collect', 'Mark collected']);
                    }

                    if (
                        !['DELIVERED', 'COLLECTED', 'CANCELLED']
                            .includes(order.status)
                    ) {
                        actions.push(['cancel', 'Cancel']);
                    }

                    return (
                        <tr key={order.id}>
                            <td>
                                <strong>{order.id}</strong>
                                <small>{dateTime(order.createdAt)}</small>
                            </td>

                            <td>{order.customer}</td>
                            <td>{money(order.total)}</td>

                            <td>
                  <span className={`ad-badge ${badge(order.status)}`}>
                    {label(order.status)}
                  </span>
                            </td>

                            <td>
                  <span className={`ad-badge ${badge(order.paymentStatus)}`}>
                    {label(order.paymentStatus)}
                  </span>
                            </td>

                            <td>
                                <div className="ad-action-group">
                                    {actions.map(([action, text]) => (
                                        <button
                                            key={action}
                                            className="ad-btn ad-small"
                                            disabled={busy}
                                            onClick={() => updateOrder(order, action)}
                                        >
                                            {busy ? 'Saving…' : text}
                                        </button>
                                    ))}

                                    {!actions.length && (
                                        <span className="ad-muted">
                        No actions
                      </span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {!shown.length && (
                <div className="ad-empty">
                    No orders returned by the backend.
                </div>
            )}
        </div>
    );
}
