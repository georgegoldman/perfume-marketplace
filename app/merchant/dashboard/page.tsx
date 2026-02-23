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
        <div>
            <header style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome back, <span className="text-gradient">{merchant?.name || 'Partner'}</span></h2>
                <p style={{ color: 'hsl(var(--text-secondary))' }}>Here&apos;s an overview of your boutique&apos;s performance.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {[
                    { label: 'Total Revenue', value: '$0.00', icon: '💰', trend: '+0%' },
                    { label: 'Active Products', value: '0', icon: '💎', trend: 'Neutral' },
                    { label: 'Pending Orders', value: '0', icon: '🛍️', trend: 'Stable' },
                    { label: 'Low Stock Alerts', value: '0', icon: '⚠️', trend: 'Clear' },
                ].map((stat) => (
                    <div key={stat.label} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                            <span style={{ fontSize: '0.75rem', color: stat.trend.includes('+') ? '#44ff44' : 'hsl(var(--text-secondary))', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>{stat.trend}</span>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.25rem' }}>{stat.label}</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="glass" style={{ padding: '2rem', minHeight: '300px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Recent Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'hsl(var(--text-secondary))', opacity: 0.5 }}>
                        <p>No recent activity yet.</p>
                        <p style={{ fontSize: '0.8rem' }}>Start by adding a product to your inventory.</p>
                    </div>
                </div>
                <div className="glass glass-gold" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button className="btn-gold" style={{ width: '100%' }}>Add New Product</button>
                        <button style={{ width: '100%', background: 'transparent', border: '1px solid hsla(var(--border-glass))', color: 'white', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>Generate Sales Report</button>
                        <button style={{ width: '100%', background: 'transparent', border: '1px solid hsla(var(--border-glass))', color: 'white', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>Contact Support</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
