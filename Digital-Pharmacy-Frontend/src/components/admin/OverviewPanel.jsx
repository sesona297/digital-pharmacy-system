
import React from 'react';
import OrderTable from './OrderTable';
import { dateTime } from '../../utils/adminFormatters';

export default function OverviewPanel({
                                          users,
                                          orders,
                                          audit,
                                          inventory,
                                          lowStock,
                                          activeOrders,
                                          deliveredOrders,
                                          loading,
                                          inventoryLoading,
                                          busyOrder,
                                          updateOrder,
                                          onNavigate
                                      }) {
    return (
        <>
            <section className="ad-stats">
                <article className="ad-stat">
                    <span className="ad-stat-icon blue">♙</span>
                    <small>Registered users</small>
                    <strong>{users.length}</strong>
                    <label>Across all roles</label>
                </article>

                <article className="ad-stat">
                    <span className="ad-stat-icon amber">▤</span>
                    <small>Low-stock products</small>
                    <strong>{lowStock}</strong>
                    <label>At or below reorder level</label>
                </article>

                <article className="ad-stat">
                    <span className="ad-stat-icon blue">▣</span>
                    <small>Active orders</small>
                    <strong>{activeOrders.length}</strong>
                    <label>Not yet completed</label>
                </article>

                <article className="ad-stat">
                    <span className="ad-stat-icon green">✓</span>
                    <small>Completed orders</small>
                    <strong>{deliveredOrders.length}</strong>
                    <label>Delivered or collected</label>
                </article>
            </section>

            <section className="ad-overview-grid">
                <article className="ad-panel">
                    <div className="ad-panel-head">
                        <div>
                            <h2>Inventory alerts</h2>
                            <p>Products at or below their reorder level</p>
                        </div>

                        <button
                            className="ad-link"
                            onClick={() => onNavigate('Inventory')}
                        >
                            View inventory →
                        </button>
                    </div>

                    {inventory
                        .filter(product => product.stock <= product.reorder)
                        .map(product => (
                            <div className="ad-alert-row" key={product.id}>
                <span className="ad-alert-icon">
                  <img
                      src={`/images/products/${String(product.id || '').toUpperCase()}.webp`}
                      alt=""
                      onError={event => {
                          event.currentTarget.style.display = 'none';
                      }}
                  />
                </span>

                                <div>
                                    <strong>{product.name}</strong>
                                    <small>
                                        {product.stock} units remaining · reorder at {product.reorder}
                                    </small>
                                </div>

                                <span className="ad-badge red">Low stock</span>
                            </div>
                        ))}

                    {lowStock === 0 && (
                        <p className="ad-muted">
                            {inventoryLoading
                                ? 'Loading inventory…'
                                : 'No low-stock items.'}
                        </p>
                    )}
                </article>

                <article className="ad-panel">
                    <div className="ad-panel-head">
                        <div>
                            <h2>Recent system activity</h2>
                            <p>Latest audit records from the backend</p>
                        </div>

                        <button
                            className="ad-link"
                            onClick={() => onNavigate('Audit Log')}
                        >
                            View audit log →
                        </button>
                    </div>

                    {audit.slice(0, 4).map(activity => (
                        <div className="ad-activity" key={activity.id}>
                            <span className="ad-activity-dot" />

                            <div>
                                <strong>
                                    {activity.action || 'System activity'}
                                </strong>

                                <small>
                                    {activity.actorRole || 'User'} #{activity.actorId ?? '—'}
                                    {' · '}
                                    {activity.entityTarget || '—'} {activity.entityId || ''}
                                </small>
                            </div>

                            <time>{dateTime(activity.timeStamp)}</time>
                        </div>
                    ))}

                    {!audit.length && (
                        <p className="ad-muted">
                            {loading
                                ? 'Loading activity…'
                                : 'No audit records returned.'}
                        </p>
                    )}
                </article>
            </section>

            <section className="ad-panel">
                <div className="ad-panel-head">
                    <div>
                        <h2>Recent orders</h2>
                        <p>Live operational overview</p>
                    </div>

                    <button
                        className="ad-link"
                        onClick={() => onNavigate('Orders & Deliveries')}
                    >
                        Manage orders →
                    </button>
                </div>

                <OrderTable
                    orders={orders}
                    updateOrder={updateOrder}
                    busyOrder={busyOrder}
                    compact
                />
            </section>
        </>
    );
}
