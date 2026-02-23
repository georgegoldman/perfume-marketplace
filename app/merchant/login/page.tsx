'use client';

import MerchantLoginForm from '@/components/MerchantLoginForm';
import Link from 'next/link';
import { Suspense } from 'react';

export default function MerchantLoginPage() {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at center, #111 0%, #050505 100%)', padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/" className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>SCENT</Link>
            </div>
            <Suspense fallback={<div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>}>
                <MerchantLoginForm />
            </Suspense>
            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
                Don&apos;t have a merchant account? <Link href="/merchant/register" style={{ color: 'hsl(var(--primary-gold))', fontWeight: 600 }}>Register Now</Link>
            </p>
        </main>
    );
}
