'use client';

import dynamic from 'next/dynamic';

const CheckoutContent = dynamic(() => import('./CheckoutContent'), {
    ssr: false,
    loading: () => (
        <main className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
            <div className="w-12 h-[1px] bg-[var(--text-primary)] animate-pulse"></div>
        </main>
    ),
});

export default function CheckoutWrapper() {
    return <CheckoutContent />;
}
