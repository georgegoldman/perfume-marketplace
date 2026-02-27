'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

    return (
        <main className="min-h-screen bg-[var(--bg-primary)]">
            <nav className="border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md sticky top-0 z-[1000]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex justify-between items-center">
                    <Link href="/" className="font-playfair text-xl font-bold tracking-widest no-underline text-[var(--text-primary)]">PARFUM ANTIQUE</Link>
                    <Link href="/browse" className="uppercase text-[0.6rem] font-black tracking-[0.3em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline">Continue Selection</Link>
                </div>
            </nav>

            <section className="py-20 lg:py-32">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <header className="mb-20 text-center">
                        <span className="uppercase text-[var(--text-secondary)] text-[0.65rem] font-black tracking-[0.4em] mb-4 block">Your Archive</span>
                        <h1 className="font-playfair text-5xl md:text-6xl font-normal text-[var(--text-primary)]">Shopping Cart</h1>
                    </header>

                    {cartItems.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-sm bg-[var(--bg-secondary)]/30">
                            <p className="font-playfair text-2xl text-[var(--text-secondary)] italic mb-10">Your selection is currently empty.</p>
                            <Link
                                href="/browse"
                                className="inline-block px-12 py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] uppercase text-[0.7rem] font-bold tracking-[0.3em] no-underline hover:opacity-90 transition-all shadow-xl"
                            >
                                Explore the Collection
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            <div className="divide-y divide-[var(--border)] border-t border-b border-[var(--border)]">
                                {cartItems.map((item) => (
                                    <div key={item.product.id} className="py-10 grid grid-cols-1 md:grid-cols-4 gap-10 items-center">
                                        <div className="aspect-[3/4] bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden relative">
                                            {item.product.imageUrl ? (
                                                <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex justify-center items-center opacity-10">
                                                    <span className="text-4xl">🧪</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <span className="uppercase text-[var(--text-secondary)] text-[0.6rem] font-black tracking-widest leading-none">
                                                {item.product.type.replace('_', ' ')}
                                            </span>
                                            <h3 className="font-playfair text-2xl font-normal text-[var(--text-primary)]">{item.product.name}</h3>
                                            <p className="text-[var(--text-secondary)] font-light">${item.product.basePrice.toFixed(2)}</p>
                                        </div>
                                        <div className="flex flex-col items-center md:items-end gap-6">
                                            <div className="flex items-center border border-[var(--border)]">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="w-10 h-10 flex justify-center items-center hover:bg-[var(--bg-secondary)] transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="w-10 h-10 flex justify-center items-center hover:bg-[var(--bg-secondary)] transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.product.id)}
                                                className="uppercase text-[0.6rem] font-black tracking-widest text-red-500 opacity-60 hover:opacity-100 transition-opacity"
                                            >
                                                Remove Item
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-[var(--bg-secondary)]/50 p-10 md:p-14 border border-[var(--border)] space-y-10">
                                <div className="flex justify-between items-end border-b border-[var(--border)] pb-8">
                                    <div>
                                        <p className="uppercase text-[var(--text-secondary)] text-[0.65rem] font-black tracking-[0.4em] mb-2">Total Selection</p>
                                        <p className="text-[var(--text-secondary)] text-sm font-light">{cartCount} items</p>
                                    </div>
                                    <p className="font-playfair text-4xl text-[var(--text-primary)] tracking-tighter">
                                        ${cartTotal.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <Link
                                        href="/checkout"
                                        className="w-full py-6 bg-[var(--text-primary)] text-[var(--bg-primary)] uppercase text-[0.7rem] font-bold tracking-[0.3em] text-center no-underline hover:opacity-90 transition-all shadow-2xl"
                                    >
                                        Proceed to Final Acquisition
                                    </Link>
                                    <p className="text-center text-[var(--text-secondary)] text-[0.6rem] uppercase tracking-[0.2em] font-medium opacity-50">
                                        Secure transaction in USD.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <footer className="py-20 border-t border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="uppercase text-[0.6rem] tracking-[0.4em] text-[var(--text-secondary)] font-medium">© 2026 Parfum Antique</p>
                </div>
            </footer>
        </main>
    );
}
