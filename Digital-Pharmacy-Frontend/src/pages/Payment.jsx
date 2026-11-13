import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { money } from '../data/products';

export default function Payment({ orderNumber, onPaid, onNotify }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        async function loadOrder() {
            if (!orderNumber) {
                setError('No order was selected for payment.');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(
                    `/order/read/${encodeURIComponent(orderNumber)}`
                );

                const data = response?.data ?? response;

                if (active) {
                    setOrder(data);
                    // Check if already paid/processing
                    const status = String(data?.orderStatus ?? '').toUpperCase();
                    if (status === 'PROCESSING' || status === 'PAID' || status === 'COMPLETED') {
                        setSuccess(true);
                    }
                }
            } catch (err) {
                if (active) {
                    setError(
                        err?.response?.data?.message ||
                        'Could not load your order details. Please try again.'
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        loadOrder();

        return () => {
            active = false;
        };
    }, [orderNumber]);

    const amount =
        order?.totalAmount ??
        order?.totalPrice ??
        order?.orderTotal ??
        order?.total ??
        order?.amount ??
        null;

    const isAlreadyPaid = success || ['PROCESSING', 'PAID', 'COMPLETED'].includes(
        String(order?.orderStatus ?? '').toUpperCase()
    );

    const handleConfirmPayment = async () => {
        if (!order?.orderNumber) {
            setError('The order number is missing.');
            return;
        }

        setPaying(true);
        setError('');

        try {
            const response = await api.post(
                `/order/${encodeURIComponent(order.orderNumber)}/pay`
            );

            const paidOrder = response?.data ?? response;

            setOrder(paidOrder);
            setSuccess(true);
            onNotify?.('Payment successful! Your order has been placed.');
            onPaid?.(paidOrder);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                'Payment could not be processed. Please try again.'
            );
        } finally {
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <main className="payment-page">
                <div className="payment-card">
                    <p>Loading order information...</p>
                </div>
            </main>
        );
    }

    if (!order) {
        return (
            <main className="payment-page">
                <section className="payment-card">
                    <h2>Checkout Error</h2>
                    <p role="alert" className="payment-error">{error || 'Order could not be found.'}</p>
                </section>
            </main>
        );
    }

    return (
        <main className="payment-page">
            <section className="payment-card">
                <p className="payment-eyebrow">PHARMAFLOW SECURE CHECKOUT</p>
                <h1>Confirm & Pay</h1>
                <p>Review your total below and click confirm to complete your order placement.</p>

                <div className="payment-details">
                    <div>
                        <span>Order Number</span>
                        <strong>{order.orderNumber}</strong>
                    </div>

                    <div>
                        <span>Status</span>
                        <strong>{String(order.orderStatus ?? 'PENDING').replaceAll('_', ' ')}</strong>
                    </div>


                </div>

                {error && <p role="alert" className="payment-error">{error}</p>}

                {isAlreadyPaid ? (
                    <div className="payment-success-banner" role="status">
                        <p>✓ This order has been successfully paid and placed.</p>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="payment-confirm-btn"
                        onClick={handleConfirmPayment}
                        disabled={paying}
                    >
                        {paying ? 'Processing Payment...' : `Pay ${amount !== null ? money(Number(amount)) : ''} & Place Order`}
                    </button>
                )}
            </section>
        </main>
    );
}
