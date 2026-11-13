
import React from 'react';
import { dateTime, label } from '../../utils/adminFormatters';

export default function AuditLog({ audit = [], loading }) {
    return (
        <section className="ad-panel">
            <div className="ad-panel-head">
                <div>
                    <h2>Audit log</h2>
                    <p>Chronological record of stored actions.</p>
                </div>

                <span className="ad-badge blue">
                    {audit.length} events
                </span>
            </div>

            <div className="ad-table-wrap">
                <table className="ad-table">
                    <thead>
                    <tr>
                        <th>Time</th>
                        <th>Actor</th>
                        <th>Action</th>
                        <th>Target</th>
                        <th>Entity ID</th>
                    </tr>
                    </thead>

                    <tbody>
                    {audit.map(activity => (
                        <tr key={activity.id}>
                            <td>{dateTime(activity.timeStamp)}</td>

                            <td>
                                <strong>
                                    {activity.actorName || 'Unknown actor'}
                                </strong>
                                <small>
                                    {activity.actorRole
                                        ? label(activity.actorRole)
                                        : 'Role unavailable'}
                                    {activity.actorId
                                        ? ` #${activity.actorId}`
                                        : ''}
                                </small>
                            </td>

                            <td>
                                {activity.action
                                    ? label(activity.action)
                                    : 'Action unavailable'}
                            </td>

                            <td>
                                {activity.entityTarget
                                    ? label(activity.entityTarget)
                                    : 'Target unavailable'}
                            </td>

                            <td>{activity.entityId || '—'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {!audit.length && (
                    <div className="ad-empty">
                        {loading
                            ? 'Loading audit log…'
                            : 'No audit records found.'}
                    </div>
                )}
            </div>
        </section>
    );
}
