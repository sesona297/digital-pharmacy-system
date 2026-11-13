
import React, { useMemo, useState } from 'react';

export default function StaffManagement({
                                            users,
                                            loading,
                                            onCreateStaff,
                                            onEditStaff,
                                            onSuspend,
                                            onReactivate,
                                            busyAccountId
                                        }) {
    const [query, setQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All staff');

    const staff = useMemo(
        () => users.filter(user =>
            ['Pharmacist', 'Courier'].includes(user.role)
        ),
        [users]
    );

    const filteredStaff = useMemo(() => {
        const search = query.trim().toLowerCase();

        return staff.filter(member => {
            const matchesRole =
                roleFilter === 'All staff' ||
                member.role === roleFilter;

            const matchesSearch =
                `${member.id} ${member.name} ${member.email} ${member.role}`
                    .toLowerCase()
                    .includes(search);

            return matchesRole && matchesSearch;
        });
    }, [staff, query, roleFilter]);

    const pharmacists = staff.filter(
        member => member.role === 'Pharmacist'
    ).length;

    const couriers = staff.filter(
        member => member.role === 'Courier'
    ).length;

    function handleStatusChange(member) {
        const suspended = member.accountStatus === 'SUSPENDED';

        const action = suspended ? 'reactivate' : 'suspend';
        const confirmed = window.confirm(
            `Are you sure you want to ${action} ${member.name}'s account?`
        );

        if (!confirmed) return;

        if (suspended) {
            onReactivate?.(member);
        } else {
            onSuspend?.(member);
        }
    }

    return (
        <section className="ad-panel">
            <div className="ad-panel-head">
                <div>
                    <h2>Staff accounts</h2>
                    <p>
                        Manage registered pharmacists and couriers.
                    </p>
                </div>

                <div className="ad-staff-heading-actions">
                    <span className="ad-badge blue">
                        {staff.length} staff
                    </span>

                    <button
                        type="button"
                        className="ad-btn"
                        onClick={onCreateStaff}
                    >
                        + Create staff account
                    </button>
                </div>
            </div>

            <div className="ad-stats">
                <article className="ad-stat">
                    <span className="ad-stat-icon blue">♙</span>
                    <small>Pharmacists</small>
                    <strong>{pharmacists}</strong>
                    <label>Registered pharmacists</label>
                </article>

                <article className="ad-stat">
                    <span className="ad-stat-icon green">↗</span>
                    <small>Couriers</small>
                    <strong>{couriers}</strong>
                    <label>Registered couriers</label>
                </article>
            </div>

            <div className="ad-toolbar">
                <input
                    type="search"
                    placeholder="Search staff name, email, ID…"
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                />

                <select
                    value={roleFilter}
                    onChange={event => setRoleFilter(event.target.value)}
                >
                    <option>All staff</option>
                    <option>Pharmacist</option>
                    <option>Courier</option>
                </select>
            </div>

            <div className="ad-table-wrap">
                <table className="ad-table">
                    <thead>
                    <tr>
                        <th>Staff member</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Account status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredStaff.map(member => {
                        const suspended =
                            member.accountStatus === 'SUSPENDED';

                        const busy =
                            String(busyAccountId) === String(member.id);

                        return (
                            <tr key={member.id}>
                                <td>
                                    <strong>{member.name}</strong>
                                    <small>{member.id}</small>
                                </td>

                                <td>{member.email || '—'}</td>
                                <td>{member.role}</td>

                                <td>
                                        <span
                                            className={`ad-badge ${suspended ? 'red' : 'green'}`}
                                        >
                                            {member.status}
                                        </span>
                                </td>

                                <td>
                                    <div className="ad-staff-heading-actions">
                                        <button
                                            type="button"
                                            className="ad-btn ad-ghost"
                                            onClick={() =>
                                                onEditStaff?.(member)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className={`ad-btn ${suspended ? '' : 'ad-ghost'}`}
                                            disabled={busy}
                                            onClick={() =>
                                                handleStatusChange(member)
                                            }
                                        >
                                            {busy
                                                ? 'Updating…'
                                                : suspended
                                                    ? 'Reactivate'
                                                    : 'Suspend'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {!filteredStaff.length && (
                    <div className="ad-empty">
                        {loading
                            ? 'Loading staff…'
                            : staff.length
                                ? 'No staff members match this search.'
                                : 'No pharmacist or courier accounts returned by the backend.'}
                    </div>
                )}
            </div>
        </section>
    );
}

