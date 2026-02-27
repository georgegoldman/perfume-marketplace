'use client';

import Link from 'next/link';

export default function CheckoutSuccessPage() {
    return (
        <main className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-8">
                <div className="text-6xl mb-4">🏆</div>
                <h1 className="font-playfair text-4xl md:text-5xl font-normal text-[var(--text-primary)]">Acquisition Finalized</h1>
                <p className="text-[var(--text-secondary)] text-lg font-light leading-relaxed">
                    Your selection has been successfully curated and the transaction is complete.
                    The artisans will now begin preparing your essences for travel.
                </p>
                <div className="pt-8">
                    <Link
                        href="/browse"
                        className="inline-block px-12 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] uppercase text-[0.7rem] font-bold tracking-[0.3em] hover:opacity-90 transition-all no-underline"
                    >
                        Return to Archive
                    </Link>
                </div>
            </div>
        </main>
    );
}
