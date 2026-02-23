import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main>
      {/* Navbar */}
      <nav className="glass" style={{ position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '1200px', zIndex: 1000, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>SCENT</h1>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/browse" style={{ fontSize: '0.9rem', fontWeight: 500, opacity: 0.8 }}>Browse</Link>
          <Link href="/merchant/login" style={{ fontSize: '0.9rem', fontWeight: 500, opacity: 0.8 }}>Merchant Portal</Link>
          <Link href="/merchant/register" className="btn-gold">Start Selling</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '100px' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '4.5rem', lineHeight: 1.1, marginBottom: '2rem' }}>
            Elevate Your <br />
            <span className="text-gradient">Sensory Identity</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'hsl(var(--text-secondary))', maxWidth: '500px', marginBottom: '3rem', lineHeight: 1.6 }}>
            Discover an exclusive collection of perfumes, oils, and diffusers. A curated marketplace for master perfumers and olfactory enthusiasts.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button className="btn-gold" style={{ padding: '16px 32px', fontSize: '1rem' }}>Explore Collection</button>
            <button style={{ background: 'transparent', border: '1px solid hsla(var(--border-glass))', color: 'white', padding: '16px 32px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>Learn More</button>
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative', height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass glass-gold" style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
            <Image
              src="/hero_perfume.png"
              alt="Luxury Perfume"
              fill
              style={{ objectFit: 'cover', opacity: 0.8 }}
              priority
            />
            <div style={{ position: 'absolute', bottom: '2rem', right: '2rem' }}>
              <span className="text-gradient" style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Olfactory Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container" style={{ paddingBottom: '120px' }}>
        <h3 style={{ fontSize: '2rem', marginBottom: '4rem', textAlign: 'center' }}>The <span className="text-gradient">Collection</span> Types</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {['Perfumes', 'Oil Perfumes', 'Diffusers', 'Deodorants'].map((type) => (
            <div key={type} className="glass" style={{ padding: '3rem 2rem', textAlign: 'center', transition: 'transform 0.3s ease' }}>
              <div style={{ width: '40px', height: '40px', background: 'hsl(var(--primary-gold))', borderRadius: '50%', margin: '0 auto 1.5rem auto', opacity: 0.2 }}></div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{type}</h4>
              <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>Premium selected {type.toLowerCase()} for every occasion.</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
