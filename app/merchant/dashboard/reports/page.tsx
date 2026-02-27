'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api-client';
import { Merchant } from '@/lib/types';

export default function ReportsPage() {
    const [merchant, setMerchant] = useState<Merchant | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSales: 0,
        orderCount: 0,
        averageOrderValue: 0,
    });

    useEffect(() => {
        const storedMerchant = localStorage.getItem('merchant');
        if (storedMerchant) {
            const m = JSON.parse(storedMerchant) as Merchant;
            setMerchant(m);
            fetchReportData(m.id);
        }
    }, []);

    const fetchReportData = async (merchantId: string) => {
        setLoading(true);
        try {
            const orders = await apiFetch(`/api/orders/merchant/${merchantId}`);
            const total = orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
            const count = orders.length;
            setStats({
                totalSales: total,
                orderCount: count,
                averageOrderValue: count > 0 ? total / count : 0,
            });
        } catch (error) {
            console.error('Fetch reports error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-16">
            <header className="mb-14">
                <h2 className="serif text-4xl md:text-5xl mb-2 font-normal text-[var(--text-primary)]">Sales Intelligence</h2>
                <p className="text-mute text-sm md:text-base">Comprehensive analysis of your boutique's market performance.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                    { label: 'Gross Sales', value: `$${stats.totalSales.toFixed(2)}`, icon: '📈' },
                    { label: 'Acquisition Volume', value: stats.orderCount.toString(), icon: '📦' },
                    { label: 'Avg Value', value: `$${stats.averageOrderValue.toFixed(2)}`, icon: '📊' },
                ].map((stat) => (
                    <div key={stat.label} className="card bg-[var(--bg-primary)] border border-[var(--border)] p-10">
                        <p className="uppercase text-mute text-[0.6rem] font-black tracking-[0.2em] mb-4">{stat.label}</p>
                        <div className="flex justify-between items-center">
                            <h3 className="serif text-4xl font-normal text-[var(--text-primary)]">{stat.value}</h3>
                            <span className="text-2xl opacity-40">{stat.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card bg-[var(--bg-primary)] border border-[var(--border)] min-h-[400px] p-10 md:p-14">
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-[var(--border)]">
                    <h3 className="serif uppercase text-xs font-black tracking-[0.2em] text-[var(--text-primary)]">Volume Over Time</h3>
                    <div className="text-[0.6rem] uppercase tracking-widest font-bold text-mute">Last 30 Days</div>
                </div>
                <div className="flex flex-col justify-center items-center py-20 text-center">
                    <p className="serif text-2xl text-mute italic font-light mb-4 text-balance max-w-md">Temporal analysis is being synthesized.</p>
                    <p className="text-mute uppercase text-[0.65rem] font-bold tracking-[0.2em] opacity-70">Further historical data points are required for a definitive trajectory.</p>
                </div>
            </div>
        </div>
    );
}
