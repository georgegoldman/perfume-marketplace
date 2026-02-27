'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';

export default function LandingPage() {
  const { cartCount } = useCart();
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header / Nav */}
      <nav className="sticky top-0 bg-[var(--bg-primary)]/90 backdrop-blur-md z-[1000] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex justify-between items-center">
          <Link href="/" className="font-playfair text-2xl font-bold tracking-widest no-underline text-[var(--text-primary)]">
            PARFUM ANTIQUE
          </Link>
          <div className="flex gap-10 items-center">
            <Link href="/cart" className="relative group no-underline flex items-center gap-2">
              <span className="text-xl">🛍️</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--text-primary)] text-[var(--bg-primary)] text-[0.6rem] font-bold w-4 h-4 rounded-full flex justify-center items-center font-inter">
                  {cartCount}
                </span>
              )}
              <span className="hidden md:block uppercase text-[0.7rem] font-bold tracking-[0.2em] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Cart</span>
            </Link>
            <Link href="/browse" className="hidden md:block uppercase text-[0.7rem] font-bold tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline">
              Discovery
            </Link>
            <Link href="/merchant/login" className="px-6 py-2.5 border border-[var(--border)] uppercase text-[0.65rem] font-bold tracking-widest hover:border-[var(--text-primary)] transition-all">
              Start Selling
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="z-10 text-center lg:text-left">
              <span className="inline-block uppercase text-[var(--text-secondary)] text-xs tracking-[0.4em] mb-6">
                The Essence of Luxury
              </span>
              <h1 className="font-playfair text-6xl md:text-8xl lg:text-9xl mb-10 leading-[0.9] font-normal tracking-tight">
                Pure <br />
                <span className="italic">Aroma.</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-lg md:text-xl mb-12 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
                Discover a curated collection of artisanal fragrances and rare botanical essences from independent creators worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/browse" className="px-10 py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] uppercase text-[0.7rem] font-bold tracking-widest hover:opacity-90 transition-all">
                  Explore the Collection
                </Link>
                <Link href="/about" className="px-10 py-5 border border-[var(--border)] uppercase text-[0.7rem] font-bold tracking-widest hover:border-[var(--text-primary)] transition-all">
                  Our Story
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[3/4] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2000&auto=format&fit=crop"
                alt="Signature Scent"
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                priority
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700"></div>
              <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                <span className="text-white text-[0.65rem] uppercase tracking-[0.3em] font-medium opacity-80">N° 01 Signature</span>
                <div className="w-12 h-[1px] bg-white/40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 md:py-40 bg-[var(--bg-secondary)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="font-playfair text-4xl md:text-6xl mb-6 font-normal">Curated Selections</h2>
              <div className="w-20 h-1 bg-[var(--text-primary)] mb-6"></div>
              <p className="text-[var(--text-secondary)] uppercase text-[0.65rem] tracking-[0.2em]">Exquisite categories for the discerning olfactory palate.</p>
            </div>
            <Link href="/browse" className="uppercase text-[0.7rem] font-bold border-b border-[var(--text-primary)] pb-1 tracking-[0.2em] hover:opacity-70 transition-opacity">
              View all categories
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Parfum', count: '124 Products', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000' },
              { name: 'Oils', count: '86 Products', img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1000' },
              { name: 'Diffusers', count: '42 Products', img: 'https://images.unsplash.com/photo-1750433101188-8284e112d250?q=80&w=1000' },
              { name: 'Ancient', count: '18 Products', img: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=1000' }
            ].map((cat) => (
              <Link href={`/browse?category=${cat.name.toLowerCase()}`} key={cat.name} className="group block relative aspect-[3/4] overflow-hidden border border-[var(--border)] bg-white">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute bottom-10 left-10">
                  <h3 className="font-playfair text-white text-2xl mb-2 font-normal transition-transform group-hover:-translate-y-2 duration-500">{cat.name}</h3>
                  <span className="text-white/70 text-[0.55rem] uppercase tracking-[0.3em] font-bold block opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    Explore Item
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 md:py-40">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-4xl md:text-6xl mb-8 font-normal">Join the Inner Circle</h2>
          <p className="text-[var(--text-secondary)] text-md md:text-lg mb-12 font-light leading-relaxed">
            Become a part of our olfactory story. Receive exclusive previews of rare essences and artisanal collaborations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 border-b border-[var(--border)] pb-4 focus-within:border-[var(--text-primary)] transition-colors">
            <input
              type="email"
              placeholder="YOUR EMAIL ESSENCE"
              className="flex-1 bg-transparent py-4 text-[0.7rem] uppercase tracking-[0.2em] outline-none placeholder:text-[var(--text-secondary)]/50"
            />
            <button className="uppercase text-[0.7rem] font-bold tracking-[0.2em] px-6">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 items-start mb-24">
            <div className="lg:col-span-1">
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-light mb-10">
                Elevating the art of perfumery through a meticulously selected marketplace of independent creators and rare botanical treasures.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><span className="uppercase text-[0.6rem] tracking-[0.2em]">IG</span></a>
                <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><span className="uppercase text-[0.6rem] tracking-[0.2em]">TW</span></a>
                <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><span className="uppercase text-[0.6rem] tracking-[0.2em]">FB</span></a>
              </div>
            </div>

            <div>
              <h4 className="uppercase text-[0.65rem] font-black tracking-[0.3em] mb-8 text-[var(--text-primary)]">Discovery</h4>
              <ul className="space-y-4">
                <li><Link href="/browse" className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] hover:text-[var(--text-primary)] no-underline">The Collection</Link></li>
                <li><Link href="/browse?category=parfum" className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] hover:text-[var(--text-primary)] no-underline">Fine Parfum</Link></li>
                <li><Link href="/browse?category=oils" className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] hover:text-[var(--text-primary)] no-underline">Botanical Oils</Link></li>
                <li><Link href="/browse?category=diffusers" className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] hover:text-[var(--text-primary)] no-underline">Ambient Scent</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="uppercase text-[0.65rem] font-black tracking-[0.3em] mb-8 text-[var(--text-primary)]">Merchants</h4>
              <ul className="space-y-4">
                <li><Link href="/merchant/login" className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] hover:text-[var(--text-primary)] no-underline">Partner Portal</Link></li>
                <li><Link href="/merchant/register" className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] hover:text-[var(--text-primary)] no-underline">Apply to Sell</Link></li>
                <li><Link href="/guidelines" className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] hover:text-[var(--text-primary)] no-underline">Quality Standards</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="uppercase text-[0.65rem] font-black tracking-[0.3em] mb-8 text-[var(--text-primary)]">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] hover:text-[var(--text-primary)] no-underline">Our Story</Link></li>
                <li><Link href="/sustainability" className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] hover:text-[var(--text-primary)] no-underline">Ethical Sourcing</Link></li>
                <li><Link href="/contact" className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] hover:text-[var(--text-primary)] no-underline">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[var(--text-secondary)] font-medium">© 2026 Parfum Antique. London / Paris / NY.</p>
            <div className="flex gap-12">
              <Link href="/privacy" className="text-[var(--text-secondary)] text-[0.6rem] uppercase tracking-[0.3em] no-underline hover:text-[var(--text-primary)]">Privacy Policy</Link>
              <Link href="/terms" className="text-[var(--text-secondary)] text-[0.6rem] uppercase tracking-[0.3em] no-underline hover:text-[var(--text-primary)]">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
