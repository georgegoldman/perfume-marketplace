'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

export default function MerchantLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            // Store merchant info and token in localStorage
            localStorage.setItem('merchant', JSON.stringify(data.merchant));
            localStorage.setItem('merchantToken', data.token);
            router.push('/merchant/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass" style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}>
            <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Merchant Login</h2>
            <p style={{ color: 'hsl(var(--text-secondary))', textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.9rem' }}>Access your olfactory boutique.</p>

            {registered && !error && <div style={{ background: 'rgba(0,255,0,0.05)', color: '#44ff44', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', border: '1px solid rgba(0,255,0,0.1)' }}>Registration successful! Please login.</div>}
            {error && <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', border: '1px solid rgba(255,0,0,0.2)' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>Email Address</label>
                    <input
                        type="email"
                        placeholder="merchant@example.com"
                        required
                        style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid hsla(var(--border-glass))', borderRadius: '8px', color: 'white', outline: 'none' }}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        required
                        style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid hsla(var(--border-glass))', borderRadius: '8px', color: 'white', outline: 'none' }}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn-gold" style={{ marginTop: '1rem', height: '48px' }} disabled={loading}>
                    {loading ? 'Authenticating...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}
