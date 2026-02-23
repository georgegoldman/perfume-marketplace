import MerchantRegisterForm from '@/components/MerchantRegisterForm';
import Link from 'next/link';

export default function MerchantRegisterPage() {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at center, #111 0%, #050505 100%)', padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/" className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>SCENT</Link>
            </div>
            <MerchantRegisterForm />
            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
                Already have a merchant account? <Link href="/merchant/login" style={{ color: 'hsl(var(--primary-gold))', fontWeight: 600 }}>Sign In</Link>
            </p>
        </main>
    );
}
