'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { apiFetch } from '@/lib/api-client';
import { Product } from '@/lib/types';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // In a real app we'd have a specific endpoint, for now we list all and find
                const products = await apiFetch('/api/discovery');
                const found = products.find((p: Product) => p.id === id);
                setProduct(found || null);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-[var(--bg-primary)]">
            <div className="w-16 h-[1px] bg-[var(--text-primary)] animate-pulse mb-8"></div>
            <p className="uppercase text-[var(--text-secondary)] text-[0.6rem] tracking-[0.4em]">Seeking Essence...</p>
        </main>
    );

    if (!product) return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-[var(--bg-primary)] px-6 text-center">
            <h2 className="font-playfair text-4xl mb-8 font-normal">Essence Not Found</h2>
            <Link href="/browse" className="px-8 py-4 border border-[var(--border)] uppercase text-[0.65rem] font-bold tracking-[0.2em] hover:border-[var(--text-primary)] transition-all">
                Return to Collection
            </Link>
        </main>
    );

    return (
        <main className="min-h-screen bg-[var(--bg-primary)]">
            <nav className="border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex justify-between items-center">
                    <Link href="/" className="font-playfair text-xl font-bold tracking-widest no-underline text-[var(--text-primary)]">SCENT</Link>
                    <Link href="/browse" className="uppercase text-[0.6rem] font-black tracking-[0.3em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline">
                        <span className="md:inline hidden">Browse Collection</span>
                        <span className="md:hidden inline">Back</span>
                    </Link>
                </div>
            </nav>

            <section className="py-12 md:py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
                        {/* Image Gallery */}
                        <div className="relative aspect-[3/4] bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden">
                            {product.imageUrl ? (
                                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" priority />
                            ) : (
                                <div className="w-full h-full flex justify-center items-center opacity-10">
                                    <span className="text-9xl tracking-tighter">🧪</span>
                                </div>
                            )}
                            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
                                <span className="bg-[var(--bg-primary)] px-4 py-1.5 text-[0.55rem] font-black uppercase tracking-[0.3em] border border-[var(--border)]">
                                    Artisan Select
                                </span>
                                <span className="text-[var(--text-secondary)] text-[0.6rem] uppercase tracking-widest font-medium">SKU: {product.items?.[0]?.sku || 'UNKNWN'}</span>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col pt-4">
                            <span className="uppercase text-[var(--text-secondary)] text-[0.65rem] font-black tracking-[0.4em] mb-4 block">
                                {product.type.replace('_', ' ')}
                            </span>
                            <h1 className="font-playfair text-5xl md:text-7xl mb-8 font-normal leading-tight text-[var(--text-primary)]">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-light text-[var(--text-primary)] mb-12 tracking-tight">
                                ${product.basePrice.toFixed(2)}
                            </p>

                            <div className="w-12 h-[1px] bg-[var(--text-primary)] mb-12"></div>

                            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-16 font-light max-w-xl">
                                {product.description || 'A masterfully crafted olfactory experience, designed to elevate your sensory presence and leave a lasting impression of refined elegance.'}
                            </p>

                            <div className="flex flex-col gap-6 mb-20">
                                <button className="w-full py-6 bg-[var(--text-primary)] text-[var(--bg-primary)] uppercase text-[0.7rem] font-bold tracking-[0.3em] hover:opacity-90 transition-all shadow-xl">
                                    Add to Selection
                                </button>
                                <div className="flex justify-center items-center gap-4 text-[0.6rem] text-[var(--text-secondary)] uppercase tracking-[0.2em] font-bold opacity-60">
                                    <div className="h-[1px] w-8 bg-[var(--border)]"></div>
                                    <span>Curated by {product.merchant?.shopName || 'Scent Boutique'}</span>
                                    <div className="h-[1px] w-8 bg-[var(--border)]"></div>
                                </div>
                            </div>

                            <div className="border-t border-[var(--border)] pt-10">
                                <h4 className="uppercase text-[0.65rem] font-black tracking-[0.3em] mb-6 text-[var(--text-primary)]">Olfactory Profile</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-[var(--text-secondary)]">
                                    <div>
                                        <p className="uppercase text-[0.55rem] font-bold tracking-[0.2em] mb-2 text-[var(--text-primary)]">Composition</p>
                                        <p className="text-sm font-light">Rare botanicals, essential extracts, and ethically sourced aromatics.</p>
                                    </div>
                                    <div>
                                        <p className="uppercase text-[0.55rem] font-bold tracking-[0.2em] mb-2 text-[var(--text-primary)]">Longevity</p>
                                        <p className="text-sm font-light">6-8 hours of sustained presence on the skin.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
