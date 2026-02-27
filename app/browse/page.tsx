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
        { id: 'ALL', name: 'All' },
        { id: 'PERFUME', name: 'Parfums' },
        { id: 'OIL_PERFUME', name: 'Oils' },
        { id: 'DIFFUSER', name: 'Diffusers' },
        { id: 'DEODORANT', name: 'Essences' },
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
        <main className="min-h-screen bg-[var(--bg-primary)]">
            {/* Minimal Nav */}
            <nav className="sticky top-0 bg-[var(--bg-primary)]/90 backdrop-blur-md z-[1000] border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex justify-between items-center">
                    <Link href="/" className="font-playfair text-xl font-bold tracking-widest no-underline text-[var(--text-primary)]">SCENT</Link>
                    <Link href="/merchant/login" className="uppercase text-[0.6rem] font-black tracking-[0.3em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline">Portal</Link>
                </div>
            </nav>

            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <header className="mb-20 text-center md:text-left">
                        <h1 className="font-playfair text-5xl md:text-7xl mb-8 font-normal">The Archive</h1>

                        <div className="flex gap-8 md:gap-12 overflow-x-auto no-scrollbar border-b border-[var(--border)] pb-4 focus:outline-none">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setFilter(cat.id)}
                                    className={`uppercase text-[0.65rem] font-black tracking-[0.3em] pb-4 transition-all whitespace-nowrap border-b-2 ${filter === cat.id
                                            ? 'text-[var(--text-primary)] border-[var(--text-primary)]'
                                            : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </header>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-[3/4] bg-[var(--bg-secondary)] border border-[var(--border)] mb-6"></div>
                                    <div className="h-4 bg-[var(--bg-secondary)] w-2/3 mb-4"></div>
                                    <div className="h-3 bg-[var(--bg-secondary)] w-1/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="py-40 text-center">
                            <p className="font-playfair text-[var(--text-secondary)] text-2xl font-light italic">The selection is currently unattainable.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                            {products.map((product) => (
                                <div key={product.id} className="group relative flex flex-col">
                                    <div className="aspect-[3/4] bg-[var(--bg-secondary)] relative overflow-hidden border border-[var(--border)] mb-6">
                                        {product.imageUrl ? (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex justify-center items-center opacity-10">
                                                <span className="text-6xl">{product.type === 'PERFUME' ? '🧪' : '✨'}</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-[var(--bg-primary)] px-3 py-1 text-[0.55rem] font-black uppercase tracking-[0.2em] border border-[var(--border)]">
                                            {product.type.replace('_', ' ')}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start mb-2 group-hover:translate-x-1 transition-transform">
                                        <h3 className="font-playfair text-xl font-normal text-[var(--text-primary)]">{product.name}</h3>
                                        <span className="text-sm font-medium tracking-tighter text-[var(--text-primary)]">${product.basePrice.toFixed(0)}</span>
                                    </div>

                                    <p className="text-[var(--text-secondary)] uppercase text-[0.6rem] tracking-[0.2em] font-medium mb-6">
                                        Artistry by {product.merchant?.shopName || 'Scent Artistry'}
                                    </p>

                                    <Link
                                        href={`/product/${product.id}`}
                                        className="mt-auto px-6 py-3 border border-[var(--border)] uppercase text-[0.65rem] font-bold tracking-[0.2em] text-center hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300"
                                    >
                                        View Essence
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <footer className="py-20 border-t border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="uppercase text-[0.6rem] tracking-[0.4em] text-[var(--text-secondary)] font-medium">© 2026 Scent Marketplace</p>
                </div>
            </footer>
        </main>
    );
}
