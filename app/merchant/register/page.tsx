import MerchantRegisterForm from '@/components/MerchantRegisterForm';
import Link from 'next/link';

export default function MerchantRegisterPage() {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-secondary)', padding: '2rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <Link href="/" className="serif" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.1em', textDecoration: 'none', color: 'black' }}>PARFUM ANTIQUE</Link>
            </div>
            <MerchantRegisterForm />
            <p className="uppercase" style={{ marginTop: '2.5rem', fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                Already a partner? <Link href="/merchant/login" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
            </p>
        </main>
    );
}
