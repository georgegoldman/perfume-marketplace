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
        <div className="card" style={{ width: '100%', maxWidth: '450px', margin: '0 auto' }}>
            <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Welcome Back</h2>
            <p className="text-mute uppercase" style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '0.7rem', letterSpacing: '0.1em' }}>Log in to your account</p>

            {registered && !error && <div style={{ background: '#f0fff4', color: '#22543d', padding: '1rem', marginBottom: '2rem', fontSize: '0.8rem', border: '1px solid #c6f6d5' }}>Registration successful. Please log in.</div>}
            {error && <div style={{ background: '#fff5f5', color: '#c53030', padding: '1rem', marginBottom: '2rem', fontSize: '0.8rem', border: '1px solid #fed7d7' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label className="uppercase" style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</label>
                    <input
                        type="email"
                        placeholder="email@example.com"
                        required
                        style={{ padding: '12px', background: 'white', border: '1px solid var(--border)', borderRadius: '0', outline: 'none', fontSize: '0.9rem' }}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label className="uppercase" style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        required
                        style={{ padding: '12px', background: 'white', border: '1px solid var(--border)', borderRadius: '0', outline: 'none', fontSize: '0.9rem' }}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <button type="submit" className="btn btn-primary uppercase" style={{ marginTop: '1rem', height: '50px', borderRadius: '0', fontSize: '0.75rem', letterSpacing: '0.1em' }} disabled={loading}>
                    {loading ? 'Authenticating...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}
