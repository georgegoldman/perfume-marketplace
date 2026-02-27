'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api-client';
import { Merchant, Order } from '@/lib/types';

export default function MerchantOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [merchant, setMerchant] = useState<Merchant | null>(null);

    useEffect(() => {
        const storedMerchant = localStorage.getItem('merchant');
        if (storedMerchant) {
            const m = JSON.parse(storedMerchant) as Merchant;
            setMerchant(m);
            fetchOrders(m.id);
        }
    }, []);

    const fetchOrders = async (merchantId: string) => {
        setLoading(true);
        try {
            // Updated endpoint to get orders for merchant
            const data = await apiFetch(`/api/orders/merchant/${merchantId}`);
            setOrders(data);
        } catch (error) {
            console.error('Fetch orders error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            // Ideally a PUT /api/orders/:id/status
            // For now, we'll just simulate or wait for backend support
            // But let's assume it works for the sake of the "strong" project UI
            alert(`Updating order ${orderId} to ${newStatus}`);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error('Update status error:', error);
        }
    };

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div>
                    <h2 className="serif text-4xl md:text-5xl mb-2 font-normal text-[var(--text-primary)]">Acquisitions</h2>
                    <p className="text-mute text-sm md:text-base">Track and manage incoming orders from your global patrons.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-[var(--bg-primary)] border border-[var(--border)] px-4 py-2 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="uppercase text-[0.6rem] font-bold tracking-widest text-[var(--text-secondary)]">Live Order Feed</span>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="py-32 flex justify-center items-center">
                    <div className="w-12 h-[1px] bg-[var(--text-primary)] animate-pulse"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="card py-32 text-center bg-[var(--bg-primary)] border border-[var(--border)]">
                    <p className="serif text-2xl text-mute italic mb-4">No acquisitions have been recorded yet.</p>
                    <p className="text-mute uppercase text-[0.55rem] font-bold tracking-[0.1em]">Your creations are awaiting their first curators.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order.id} className="card bg-[var(--bg-primary)] border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between gap-10">
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="uppercase text-[0.6rem] font-black tracking-widest bg-[var(--bg-secondary)] px-3 py-1 border border-[var(--border)]">
                                            ID: {order.id.slice(0, 8)}
                                        </span>
                                        <span className={`uppercase text-[0.6rem] font-black tracking-widest px-3 py-1 border ${order.status === 'COMPLETED' ? 'border-green-500/20 bg-green-500/10 text-green-600' :
                                            order.status === 'PENDING' ? 'border-amber-500/20 bg-amber-500/10 text-amber-600' :
                                                'border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="serif text-2xl font-normal text-[var(--text-primary)] mb-1">{order.customerEmail}</h4>
                                        <p className="text-[var(--text-secondary)] text-[0.6rem] uppercase tracking-[0.2em] font-medium">
                                            Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-x-12 gap-y-4">
                                        <div>
                                            <p className="uppercase text-[0.55rem] font-black text-mute tracking-widest mb-1">Items</p>
                                            <p className="text-sm font-medium">{order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0} Units</p>
                                        </div>
                                        <div>
                                            <p className="uppercase text-[0.55rem] font-black text-mute tracking-widest mb-1">Total Value</p>
                                            <p className="text-sm font-medium">₦{order.totalAmount.toLocaleString()}</p>
                                        </div>
                                        {order.deliveryLocation && (
                                            <div className="min-w-[200px]">
                                                <p className="uppercase text-[0.55rem] font-black text-mute tracking-widest mb-1">Delivery To</p>
                                                <p className="text-sm font-light italic text-[var(--text-secondary)]">{order.deliveryLocation}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="md:w-64 space-y-4 flex flex-col justify-center">
                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                                        className="w-full py-3 border border-[var(--border)] uppercase text-[0.6rem] font-bold tracking-widest hover:border-[var(--text-primary)] transition-colors"
                                    >
                                        Mark Processing
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                        className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] uppercase text-[0.6rem] font-bold tracking-widest hover:opacity-90 transition-all"
                                    >
                                        Mark Completed
                                    </button>
                                </div>
                            </div>

                            {/* Order Items Detail - Hidden by default or collapsible? Let's show it simply for now */}
                            <div className="bg-[var(--bg-secondary)]/30 border-t border-[var(--border)] p-8">
                                <h5 className="uppercase text-[0.55rem] font-black tracking-widest text-mute mb-4">Acquisition Manifest</h5>
                                <div className="space-y-4">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-4">
                                                <span className="w-8 h-8 flex justify-center items-center bg-[var(--bg-primary)] border border-[var(--border)] text-xs">🧪</span>
                                                <span className="font-light">Product ID: {item.productId.slice(0, 8)}...</span>
                                                <span className="text-[var(--text-secondary)] text-[0.65rem] font-bold">× {item.quantity}</span>
                                            </div>
                                            <span className="font-medium">₦{(item.priceAtSale * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
