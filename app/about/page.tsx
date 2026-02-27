'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[var(--bg-primary)]">
            {/* Standard Navigation */}
            <nav className="sticky top-0 bg-[var(--bg-primary)]/90 backdrop-blur-md z-[1000] border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex justify-between items-center">
                    <Link href="/" className="font-playfair text-2xl font-bold tracking-widest no-underline text-[var(--text-primary)]">
                        PARFUM ANTIQUE
                    </Link>
                    <Link href="/browse" className="uppercase text-[0.7rem] font-bold tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline">
                        Back to Collection
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-24 md:py-40">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="order-2 lg:order-1">
                            <span className="inline-block uppercase text-[var(--text-secondary)] text-[0.7rem] tracking-[0.4em] mb-8">
                                Our Story
                            </span>
                            <h1 className="font-playfair text-5xl md:text-7xl mb-12 leading-[1.1] font-normal tracking-tight">
                                Crafting Immortality <br />
                                <span className="italic">Captured in a Bottle</span>
                            </h1>
                            <div className="w-16 h-[1px] bg-[var(--text-primary)] mb-12"></div>

                            <div className="space-y-8 text-[var(--text-secondary)] text-lg leading-relaxed font-light max-w-xl">
                                <p>
                                    Parfum Antique was born from a singular vision: to strip away the noise of the modern world and return to the pure, elemental power of fragrance. We believe that a scent is more than just a preference—it is a narrative, a memory, and a quiet statement of being.
                                </p>
                                <p>
                                    Our curated collection brings together the work of independent artisans and master perfumers who share our commitment to minimalism and excellence. By removing the gloss of traditional luxury, we reveal the raw beauty of the ingredients themselves.
                                </p>
                            </div>

                            <div className="mt-16 flex flex-col sm:flex-row gap-4">
                                <Link href="/browse" className="px-10 py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] uppercase text-[0.7rem] font-bold tracking-widest hover:opacity-90 transition-all text-center">
                                    Explore the Collection
                                </Link>
                                <Link href="/merchant/register" className="px-10 py-5 border border-[var(--border)] uppercase text-[0.7rem] font-bold tracking-widest hover:border-[var(--text-primary)] transition-all text-center">
                                    Join the Guild
                                </Link>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="relative aspect-[4/5] bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden">
                                <Image
                                    src="/about-hero.png"
                                    alt="Artisanal Fragrance"
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[var(--text-secondary)] font-medium">
                        © 2026 Parfum Antique. London / Paris / NY.
                    </p>
                </div>
            </footer>
        </main>
    );
}
