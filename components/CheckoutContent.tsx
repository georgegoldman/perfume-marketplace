'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';
import { usePaystackPayment } from 'react-paystack';
import { apiFetch } from '@/lib/api-client';

export default function CheckoutContent() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [deliveryLocation, setDeliveryLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const config = {
        reference: (new Date()).getTime().toString(),
        email: email,
        amount: Math.round(cartTotal * 100), // Base * 100 for kobo
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        currency: 'NGN',
    };

    const initializePayment = usePaystackPayment(config);

    const onPaymentSuccess = async (reference: any) => {
        setIsSubmitting(true);
        try {
            // Group items by merchantId
            const merchantGroups = cartItems.reduce((acc, item) => {
                const mId = item.product.merchantId;
                if (!acc[mId]) acc[mId] = [];
                acc[mId].push({
                    productId: item.product.id,
                    quantity: item.quantity,
                    priceAtSale: item.product.basePrice
                });
                return acc;
            }, {} as Record<string, any[]>);

            // Create an order for each merchant
            const orderPromises = Object.entries(merchantGroups).map(([merchantId, items]) => {
                return apiFetch('/api/orders', {
                    method: 'POST',
                    body: JSON.stringify({
                        merchantId,
                        customerEmail: email,
                        deliveryLocation: deliveryLocation,
                        payment_reference: reference.reference,
                        items
                    })
                });
            });

            await Promise.all(orderPromises);

            clearCart();
            router.push('/checkout/success');
        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.message || 'Failed to process order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const onPaymentClose = () => {
        setError('The transaction was terminated by the curator.');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
            setError('Payment gateway not configured. Please add your Paystack Public Key.');
            return;
        }

        // @ts-ignore
        initializePayment(onPaymentSuccess, onPaymentClose);
    };

    if (cartItems.length === 0) {
        return (
            <main className="min-h-screen flex flex-col justify-center items-center bg-[var(--bg-primary)] px-6 text-center">
                <h2 className="font-playfair text-4xl mb-8 font-normal text-[var(--text-primary)]">Your Archive is Empty</h2>
                <Link href="/browse" className="px-8 py-4 border border-[var(--border)] uppercase text-[0.65rem] font-bold tracking-[0.2em] hover:border-[var(--text-primary)] transition-all no-underline text-inherit">
                    Return to Collection
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--bg-primary)]">
            <nav className="border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex justify-between items-center">
                    <Link href="/" className="font-playfair text-xl font-bold tracking-widest no-underline text-[var(--text-primary)]">PARFUM ANTIQUE</Link>
                    <Link href="/cart" className="uppercase text-[0.6rem] font-black tracking-[0.3em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline">Back to Archive</Link>
                </div>
            </nav>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">
                        {/* Checkout Form */}
                        <div className="space-y-16">
                            <header>
                                <span className="uppercase text-[var(--text-secondary)] text-[0.65rem] font-black tracking-[0.4em] mb-4 block">Acquisition</span>
                                <h1 className="font-playfair text-5xl md:text-6xl font-normal text-[var(--text-primary)]">Finalize Order</h1>
                            </header>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[0.7rem] uppercase font-bold tracking-widest text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="uppercase text-[0.55rem] font-black text-[var(--text-secondary)] tracking-[0.2em] block">Your Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Alexander Scent..."
                                            className="w-full bg-transparent border-b border-[var(--border)] py-4 text-lg font-light outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--border)]"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="uppercase text-[0.55rem] font-black text-[var(--text-secondary)] tracking-[0.2em] block">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="honor@fragrance.com"
                                            className="w-full bg-transparent border-b border-[var(--border)] py-4 text-lg font-light outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--border)]"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="uppercase text-[0.55rem] font-black text-[var(--text-secondary)] tracking-[0.2em] block">Delivery Location</label>
                                        <textarea
                                            required
                                            value={deliveryLocation}
                                            onChange={(e) => setDeliveryLocation(e.target.value)}
                                            placeholder="123 Fragrance Lane, Scent City..."
                                            className="w-full bg-transparent border-b border-[var(--border)] py-4 text-lg font-light outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--border)] min-h-[100px] resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-10">
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full py-6 bg-[var(--text-primary)] text-[var(--bg-primary)] uppercase text-[0.75rem] font-bold tracking-[0.4em] hover:opacity-90 transition-all shadow-2xl disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Processing Acquisition...' : 'Complete Acquisition'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-[var(--bg-secondary)]/50 border border-[var(--border)] p-10 md:p-14 sticky top-32">
                            <h3 className="uppercase text-[0.65rem] font-black tracking-[0.4em] mb-12 text-[var(--text-primary)] pb-6 border-b border-[var(--border)]">Summary of Selection</h3>
                            <div className="space-y-8 mb-12">
                                {cartItems.map((item) => (
                                    <div key={item.product.id} className="flex justify-between items-start gap-6">
                                        <div className="flex-1">
                                            <p className="font-playfair text-lg text-[var(--text-primary)] leading-tight mb-1">{item.product.name}</p>
                                            <p className="text-[var(--text-secondary)] text-[0.6rem] uppercase tracking-widest font-black">QTY: {item.quantity}</p>
                                        </div>
                                        <p className="text-[var(--text-primary)] font-medium tracking-tighter">₦{(item.product.basePrice * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-8 border-t border-[var(--border)]">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="uppercase text-[0.55rem] font-black text-[var(--text-secondary)] tracking-[0.2em]">Subtotal</span>
                                    <span className="text-[var(--text-primary)] font-medium tracking-tighter">₦{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-end mb-8">
                                    <span className="uppercase text-[0.55rem] font-black text-[var(--text-secondary)] tracking-[0.2em]">Shipping</span>
                                    <span className="uppercase text-[0.6rem] font-black text-green-600 tracking-widest">Complimentary</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="uppercase text-[0.7rem] font-black text-[var(--text-primary)] tracking-[0.3em]">Total</span>
                                    <span className="font-playfair text-4xl text-[var(--text-primary)] tracking-tighter">₦{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
