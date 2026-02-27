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
                setMerchant(parsed);
            }
        }
    }, [router, merchant?.id]);

    const handleLogout = () => {
        localStorage.removeItem('merchant');
        router.push('/merchant/login');
    };

    if (!merchant) return (
        <div className="min-h-screen flex justify-center items-center bg-[var(--bg-secondary)] text-[var(--text-primary)]">
             <div className="w-12 h-[1px] bg-[var(--text-primary)] animate-pulse"></div>
        </div>
    );

    const navItems = [
        { name: 'Overview', path: '/merchant/dashboard', icon: '📊' },
        { name: 'Inventory', path: '/merchant/dashboard/inventory', icon: '💎' },
        { name: 'Orders', path: '/merchant/dashboard/orders', icon: '🛍️' },
        { name: 'Settings', path: '/merchant/dashboard/settings', icon: '⚙️' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)]">
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Desktop */}
                <aside className="hidden lg:flex w-72 bg-[var(--bg-primary)] border-r border-[var(--border)] flex-col sticky top-0 h-screen z-50">
                    <div className="p-10">
                        <Link href="/" className="font-playfair text-2xl font-bold tracking-widest no-underline text-inherit">SCENT</Link>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <p className="uppercase text-[0.6rem] font-bold tracking-widest text-[var(--text-secondary)]">{merchant.shopName || 'Boutique'}</p>
                        </div>
                    </div>

                    <nav className="flex-1 px-6 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-4 px-6 py-4 uppercase text-[0.65rem] font-black tracking-widest no-underline transition-all duration-200 border-l-2 ${
                                    pathname === item.path 
                                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--text-primary)]' 
                                    : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-8 border-t border-[var(--border)] mt-auto bg-[var(--bg-secondary)]/30">
                        <div className="mb-6">
                            <p className="uppercase text-[0.7rem] font-black tracking-widest truncate">{merchant.name}</p>
                            <p className="text-[var(--text-secondary)] text-[0.6rem] font-medium truncate opacity-60">{merchant.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full py-3 border border-[var(--border)] uppercase text-[0.6rem] font-bold tracking-widest hover:border-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto min-w-0">
                    <div className="w-full max-w-[1400px] mx-auto p-6 md:p-12 lg:p-16 mb-20 lg:mb-0">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-[var(--bg-primary)]/90 backdrop-blur-lg border-t border-[var(--border)] flex justify-around items-center px-4 z-[1000] shadow-2xl">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex flex-col items-center gap-1.5 no-underline transition-all ${
                            pathname === item.path ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] opacity-50'
                        }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="uppercase text-[0.55rem] font-black tracking-tighter">{item.name}</span>
                        {pathname === item.path && <div className="absolute -bottom-1 w-8 h-[2px] bg-[var(--text-primary)]"></div>}
                    </Link>
                ))}
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center gap-1.5 text-[var(--text-secondary)] opacity-50"
                >
                    <span className="text-xl">🚪</span>
                    <span className="uppercase text-[0.55rem] font-black tracking-tighter">Exit</span>
                </button>
            </nav>
            {/* Safe Spacer for Mobile Nav */}
            <div className="lg:hidden h-20"></div>
        </div>
    );
}
