'use client';

import Link from 'next/link';

export default function AboutPage() {
    return (
        <main>
            <nav>
                <div className="container" style={{ height: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="/" className="serif" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.1em', textDecoration: 'none', color: 'inherit' }}>SCENT</Link>
                    <Link href="/browse" className="uppercase" style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none' }}>Back to Collection</Link>
                </div>
            </nav>

            <section style={{ padding: '120px 0' }}>
                <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
                    <span className="uppercase text-mute" style={{ fontSize: '0.75rem', marginBottom: '1.5rem', display: 'block', letterSpacing: '0.2rem' }}>Our Story</span>
                    <h1 className="serif" style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '3rem', fontWeight: 400 }}>
                        Crafting Immortality <br />
                        <span style={{ fontStyle: 'italic' }}>Captured in a Bottle</span>
                    </h1>

                    <div style={{ width: '40px', height: '1px', background: 'var(--border)', margin: '0 auto 3rem' }}></div>

                    <p className="text-mute" style={{ fontSize: '1.125rem', lineHeight: 2, marginBottom: '3rem', fontWeight: 300, textAlign: 'justify' }}>
                        Scent Marketplace was born from a singular vision: to strip away the noise of the modern world and return to the pure, elemental power of fragrance. We believe that a scent is more than just a preference—it is a narrative, a memory, and a quiet statement of being.
                    </p>

                    <p className="text-mute" style={{ fontSize: '1.125rem', lineHeight: 2, marginBottom: '3rem', fontWeight: 300, textAlign: 'justify' }}>
                        Our curated collection brings together the work of independent artisans and master perfumers who share our commitment to minimalism and excellence. By removing the gloss of traditional luxury, we reveal the raw beauty of the ingredients themselves.
                    </p>

                    <div style={{ marginTop: '5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/browse" className="btn btn-primary uppercase" style={{ padding: '16px 40px' }}>Explore Collection</Link>
                        <Link href="/merchant/register" className="btn btn-outline uppercase" style={{ padding: '16px 40px' }}>Join the Guild</Link>
                    </div>
                </div>
            </section>

            <footer style={{ padding: '60px 0', borderTop: '1px solid var(--border)', marginTop: '80px' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <p className="uppercase text-mute" style={{ fontSize: '0.7rem' }}>© 2026 Scent Marketplace</p>
                </div>
            </footer>
        </main>
    );
}
