
import React from 'react';

export default function StaffFormModal({
                                           mode = 'create',
                                           staffForm,
                                           setStaffForm,
                                           staffError,
                                           creatingStaff,
                                           onSubmit,
                                           onClose
                                       }) {
    const editing = mode === 'edit';

    function updateField(field, value) {
        setStaffForm(previous => ({
            ...previous,
            [field]: value
        }));
    }

    const busy = creatingStaff;

    return (
        <div className="ad-modal-overlay">
            <section
                className="ad-staff-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="staff-modal-title"
            >
                <div className="ad-panel-head">
                    <div>
                        <h2 id="staff-modal-title">
                            {editing
                                ? 'Edit staff details'
                                : 'Create staff account'}
                        </h2>

                        <p>
                            {editing
                                ? 'Update the staff member’s name and phone number.'
                                : 'Register a new pharmacist or courier.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="ad-link"
                        onClick={onClose}
                        disabled={busy}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <label>
                        Full name
                        <input
                            type="text"
                            value={staffForm.fullName}
                            onChange={event =>
                                updateField('fullName', event.target.value)
                            }
                            maxLength={120}
                            required
                        />
                    </label>

                    {!editing && (
                        <>
                            <label>
                                Company email address
                                <input
                                    type="email"
                                    value={staffForm.email}
                                    onChange={event =>
                                        updateField('email', event.target.value)
                                    }
                                    placeholder="firstname.lastname@pharmaflow.com"
                                    title="Staff accounts must use an @pharmaflow.com email address."
                                    required
                                />
                            </label>

                            <label>
                                Temporary password
                                <input
                                    type="password"
                                    value={staffForm.password}
                                    onChange={event =>
                                        updateField('password', event.target.value)
                                    }
                                    minLength={8}
                                    maxLength={72}
                                    required
                                />
                            </label>

                            <label>
                                Staff role
                                <select
                                    value={staffForm.role}
                                    onChange={event =>
                                        updateField('role', event.target.value)
                                    }
                                >
                                    <option value="PHARMACIST">
                                        Pharmacist
                                    </option>
                                    <option value="COURIER">
                                        Courier
                                    </option>
                                </select>
                            </label>
                        </>
                    )}

                    {editing && (
                        <label>
                            Email address
                            <input
                                type="email"
                                value={staffForm.email || ''}
                                disabled
                            />
                        </label>
                    )}

                    <label>
                        Phone number
                        <input
                            type="tel"
                            value={staffForm.phone}
                            onChange={event =>
                                updateField('phone', event.target.value)
                            }
                        />
                    </label>

                    {staffError && (
                        <div className="ad-staff-error" role="alert">
                            {staffError}
                        </div>
                    )}

                    <div className="ad-staff-modal-actions">
                        <button
                            type="button"
                            className="ad-btn ad-ghost"
                            onClick={onClose}
                            disabled={busy}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="ad-btn"
                            disabled={busy}
                        >
                            {busy
                                ? editing
                                    ? 'Saving changes…'
                                    : 'Creating account…'
                                : editing
                                    ? 'Save changes'
                                    : 'Create account'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

