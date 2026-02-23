'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Merchant } from '@/lib/types';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [merchant, setMerchant] = useState<Merchant | null>(null);

    useEffect(() => {
        const storedMerchant = localStorage.getItem('merchant');
        if (!storedMerchant) {
            router.push('/merchant/login');
        } else {
            const parsed = JSON.parse(storedMerchant) as Merchant;
            if (parsed.id !== merchant?.id) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setMerchant(parsed);
            }
        }
    }, [router, merchant?.id]);

    const handleLogout = () => {
        localStorage.removeItem('merchant');
        router.push('/merchant/login');
    };

    if (!merchant) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'hsl(var(--bg-deep))', color: 'white' }}>Authenticating...</div>;

    const navItems = [
        { name: 'Overview', path: '/merchant/dashboard', icon: '📊' },
        { name: 'Inventory', path: '/merchant/dashboard/inventory', icon: '💎' },
        { name: 'Orders', path: '/merchant/dashboard/orders', icon: '🛍️' },
        { name: 'Settings', path: '/merchant/dashboard/settings', icon: '⚙️' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'hsl(var(--bg-deep))' }}>
            {/* Sidebar */}
            <aside className="glass" style={{ width: '280px', margin: '1rem', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '2rem', borderRadius: '24px' }}>
                <div style={{ padding: '0 1rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>SCENT</h1>
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--primary-gold))', fontWeight: 600, letterSpacing: '0.1em', marginTop: '0.5rem' }}>{merchant.shopName || 'Boutique'}</p>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            style={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                color: pathname === item.path ? 'hsl(var(--bg-deep))' : 'white',
                                background: pathname === item.path ? 'hsl(var(--primary-gold))' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'all 0.2s ease',
                                textDecoration: 'none'
                            }}
                        >
                            <span>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid hsla(var(--border-glass))', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '0 1rem' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{merchant.name}</p>
                        <p style={{ fontSize: '0.7rem', color: 'hsl(var(--text-secondary))' }}>{merchant.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'transparent',
                            border: '1px solid hsla(var(--border-glass))',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            width: '100%'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}
