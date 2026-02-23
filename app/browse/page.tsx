'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiFetch } from '@/lib/api-client';
import { Product } from '@/lib/types';

export default function BrowsePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    const categories = [
        { id: 'ALL', name: 'All Scents' },
        { id: 'PERFUME', name: 'Perfumes' },
        { id: 'OIL_PERFUME', name: 'Oils' },
        { id: 'DIFFUSER', name: 'Diffusers' },
        { id: 'DEODORANT', name: 'Deodorants' },
    ];

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const endpoint = filter === 'ALL' ? '/api/discovery' : `/api/discovery?type=${filter}`;
            const data = await apiFetch(endpoint);
            setProducts(data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <main style={{ minHeight: '100vh', background: 'hsl(var(--bg-deep))', color: 'white' }}>
            {/* Navbar Shorthand */}
            <nav className="glass" style={{ margin: '1rem auto', width: '90%', maxWidth: '1200px', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 700 }}>SCENT</Link>
                <Link href="/merchant/login" style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>Merchant Portal</Link>
            </nav>

            <section className="container">
                <header style={{ marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Browse our <span className="text-gradient">Collections</span></h1>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '100px',
                                    background: filter === cat.id ? 'hsl(var(--primary-gold))' : 'rgba(255,255,255,0.05)',
                                    color: filter === cat.id ? 'hsl(var(--bg-deep))' : 'white',
                                    border: '1px solid hsla(var(--border-glass))',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </header>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="glass" style={{ height: '400px', opacity: 0.3 }}></div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ padding: '8rem 0', textAlign: 'center', opacity: 0.5 }}>
                        <p style={{ fontSize: '1.2rem' }}>No scents found in this collection.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {products.map((product) => (
                            <div key={product.id} className="glass" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
                                <div style={{ height: '240px', background: 'linear-gradient(45deg, #111, #222)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                                    {product.imageUrl ? (
                                        <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '3rem', opacity: 0.3 }}>💎</span>
                                    )}
                                    <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                        {product.type.replace('_', ' ')}
                                    </span>
                                </div>
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{product.name}</h3>
                                        <span style={{ color: 'hsl(var(--primary-gold))', fontWeight: 700 }}>${product.basePrice.toFixed(2)}</span>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', marginBottom: '1rem' }}>by {product.merchant?.shopName || 'Luxury Boutique'}</p>

                                    <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn-gold" style={{ flex: 1, padding: '10px', fontSize: '0.75rem' }}>View Details</button>
                                        <button style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid hsla(var(--border-glass))', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>🛒</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <footer style={{ marginTop: '8rem', padding: '4rem 0', borderTop: '1px solid hsla(var(--border-glass))', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>© 2026 SCENT Marketplace. Pure Elegance.</p>
            </footer>
        </main>
    );
}
