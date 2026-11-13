
export const money = value =>
    `R ${Number(value || 0).toFixed(2)}`;

export const label = value =>
    String(value || '—')
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/\b\w/g, character => character.toUpperCase());

export const badge = value =>
    /delivered|collected|active|paid/i.test(value)
        ? 'green'
        : /cancel|declined|suspend|issue|low/i.test(value)
            ? 'red'
            : /pending|processing|packed|ready|transit|shipped/i.test(value)
                ? 'amber'
                : 'blue';

export const dateTime = value =>
    value ? new Date(value).toLocaleString() : '—';

export function normaliseUser(user) {
    const accountStatus = String(
        user.accountStatus || 'UNKNOWN'
    ).toUpperCase();

    return {
        ...user,
        name: user.fullName || user.name || 'Unnamed user',
        role: label(user.role),
        accountStatus,
        status: label(accountStatus)
    };
}

export function normaliseOrder(order) {
    return {
        ...order,
        id: order.orderNumber || order.id,
        customer: order.customerId || '—',
        total: Number(order.totalAmt ?? order.total ?? 0),
        status: order.orderStatus || order.status || 'PENDING',
        paymentStatus: order.paymentStatus || 'PENDING',
        type: order.orderType || '—'
    };
}

