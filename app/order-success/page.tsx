'use client';

import Link from 'next/link';

export default function OrderSuccessPage() {
    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-[var(--bg-primary)] px-6 text-center">
            <div className="mb-16">
                <span className="text-8xl block mb-10">✨</span>
                <span className="uppercase text-[var(--text-secondary)] text-[0.65rem] font-black tracking-[0.4em] mb-4 block">Confirmed</span>
                <h1 className="font-playfair text-5xl md:text-7xl font-normal text-[var(--text-primary)] mb-8">Acquisition Complete</h1>
                <p className="text-[var(--text-secondary)] text-lg font-light max-w-xl mx-auto leading-relaxed">
                    Your selection has been archived and sent to our master artisans. You will receive an invoice and tracking details via email shortly.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                <Link
                    href="/browse"
                    className="px-12 py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] uppercase text-[0.7rem] font-bold tracking-[0.3em] no-underline hover:opacity-90 transition-all shadow-xl"
                >
                    Continue Exploration
                </Link>
                <Link
                    href="/"
                    className="px-12 py-5 border border-[var(--border)] uppercase text-[0.7rem] font-bold tracking-[0.3em] no-underline hover:border-[var(--text-primary)] transition-all"
                >
                    Return Home
                </Link>
            </div>

            <div className="mt-24 pt-12 border-t border-[var(--border)] w-full max-w-lg">
                <p className="text-[var(--text-secondary)] text-[0.6rem] uppercase tracking-[0.2em] font-medium opacity-50">
                    Thank you for choosing Parfum Antique.
                </p>
            </div>
        </main>
    );
}
