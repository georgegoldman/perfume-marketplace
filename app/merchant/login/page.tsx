'use client';

import MerchantLoginForm from '@/components/MerchantLoginForm';
import Link from 'next/link';
import { Suspense } from 'react';

export default function MerchantLoginPage() {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-secondary)', padding: '2rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <Link href="/" className="serif" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.1em', textDecoration: 'none', color: 'black' }}>SCENT</Link>
            </div>
            <Suspense fallback={<div className="card" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>}>
                <MerchantLoginForm />
            </Suspense>
            <p className="uppercase" style={{ marginTop: '2.5rem', fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                New partner? <Link href="/merchant/register" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>Register</Link>
            </p>
        </main>
    );
}
