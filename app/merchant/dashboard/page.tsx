'use client';

import { useState, useEffect } from 'react';
import { Merchant } from '@/lib/types';

export default function MerchantDashboard() {
    const [merchant, setMerchant] = useState<Merchant | null>(null);

    useEffect(() => {
        const storedMerchant = localStorage.getItem('merchant');
        if (storedMerchant) {
            const parsed = JSON.parse(storedMerchant) as Merchant;
            if (parsed.id !== merchant?.id) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setMerchant(parsed);
            }
        }
    }, [merchant?.id]);

    return (
        <div className="space-y-16">
            <header className="mb-14">
                <h2 className="serif text-4xl md:text-5xl mb-2 font-normal text-[var(--text-primary)]">
                    Welcome back, {merchant?.name || 'Partner'}
                </h2>
                <p className="text-mute text-sm md:text-base">
                    Your olfactory boutique summary.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {[
                    { label: 'Total Revenue', value: '$0.00', icon: '💰', trend: '0%' },
                    { label: 'Active Products', value: '0', icon: '💎', trend: 'Neutral' },
                    { label: 'Pending Orders', value: '0', icon: '🛍️', trend: 'Stable' },
                    { label: 'Inventory Health', value: '100%', icon: '🌿', trend: 'Optimal' },
                ].map((stat) => (
                    <div key={stat.label} className="card group hover:shadow-lg transition-all duration-300">
                        <p className="uppercase text-mute text-[0.6rem] font-black tracking-[0.2em] mb-4">
                            {stat.label}
                        </p>
                        <div className="flex justify-between items-baseline">
                            <h3 className="serif text-3xl font-normal text-[var(--text-primary)]">
                                {stat.value}
                            </h3>
                            <span className="text-[0.6rem] text-[var(--text-secondary)] font-bold opacity-60">
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="card lg:col-span-2 min-h-[400px] flex flex-col">
                    <h3 className="serif uppercase text-xs font-black tracking-[0.2em] mb-10 text-[var(--text-primary)]">
                        Recent Activity
                    </h3>
                    <div className="flex-1 flex flex-col justify-center items-center text-center py-20">
                        <p className="serif text-2xl text-mute mb-4 italic font-light">
                            The stage is set.
                        </p>
                        <p className="text-mute uppercase text-[0.65rem] font-bold tracking-[0.1em] opacity-70">
                            Add your first product to begin.
                        </p>
                    </div>
                </div>

                <div className="card bg-[var(--bg-primary)] h-fit">
                    <h3 className="serif uppercase text-xs font-black tracking-[0.2em] mb-8 text-[var(--text-primary)]">
                        Quick Actions
                    </h3>
                    <div className="flex flex-col gap-4">
                        <button className="px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] uppercase text-[0.65rem] font-bold tracking-[0.2em] hover:opacity-90 transition-all">
                            New Product
                        </button>
                        <button className="px-8 py-4 border border-[var(--border)] uppercase text-[0.65rem] font-bold tracking-[0.2em] hover:border-[var(--text-primary)] transition-all text-[var(--text-primary)]">
                            Sales Report
                        </button>
                        <button className="px-8 py-4 border border-[var(--border)] uppercase text-[0.65rem] font-bold tracking-[0.2em] hover:border-[var(--text-primary)] transition-all text-[var(--text-primary)]">
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
