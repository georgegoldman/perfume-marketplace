'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

export default function MerchantRegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        shopName: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await apiFetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    shop_name: formData.shopName // Map to snake_case for Rust
                }),
            });

            router.push('/merchant/login?registered=true');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ width: '100%', maxWidth: '450px', margin: '0 auto' }}>
            <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Become a Partner</h2>
            <p className="text-mute uppercase" style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '0.7rem', letterSpacing: '0.1em' }}>Join our curated marketplace</p>

            {error && <div style={{ background: '#fff5f5', color: '#c53030', padding: '1rem', marginBottom: '2rem', fontSize: '0.8rem', border: '1px solid #fed7d7' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label className="uppercase" style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        style={{ padding: '12px', background: 'white', border: '1px solid var(--border)', borderRadius: '0', outline: 'none', fontSize: '0.9rem' }}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label className="uppercase" style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
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
                    <label className="uppercase" style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Shop Name</label>
                    <input
                        type="text"
                        placeholder="Boutique Name"
                        style={{ padding: '12px', background: 'white', border: '1px solid var(--border)', borderRadius: '0', outline: 'none', fontSize: '0.9rem' }}
                        value={formData.shopName}
                        onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
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
                    {loading ? 'Creating Account...' : 'Register Account'}
                </button>
            </form>
        </div>
    );
}
