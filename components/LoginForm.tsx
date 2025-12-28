// components/LoginForm

'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/services/firebase/config';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation'

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('LoginForm: handleSubmit triggered');
        setError(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('username') as string;
        const password = formData.get('password') as string;

        try {
            console.log('LoginForm: attempting signInWithEmailAndPassword', { email, password: password ? '***' : '' });
            // 1️⃣ Firebase Auth
            const cred = await signInWithEmailAndPassword(auth, email, password);
            console.log('LoginForm: signIn successful', cred.user?.uid);
            if (!cred.user) throw new Error('Auth başarısız');

            // Sunucu tarafında __session cookie'si oluşturmak için idToken al ve POST et
            try {
                const idToken = await cred.user.getIdToken();
                console.log('LoginForm: sending idToken to /api/auth/session');
                const sessRes = await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken })
                });
                if (!sessRes.ok) {
                    console.error('LoginForm: /api/auth/session failed', await sessRes.text());
                    setError('Oturum oluşturulamadı');
                    setLoading(false);
                    return;
                }
                console.log('LoginForm: session cookie set');
            } catch (sessionErr) {
                console.error('LoginForm: session create error', sessionErr);
                setError('Oturum oluşturulamadı');
                setLoading(false);
                return;
            }

            // 2️⃣ Firestore users kontrol
            const q = query(
                collection(db, 'users'),
                where('email', '==', email)
            );

            const snap = await getDocs(q);
            console.log('LoginForm: getDocs completed', { size: snap.size, empty: snap.empty });

            if (snap.empty) {
                throw new Error('Bu kullanıcı sistemde tanımlı değil');
            }

            // ✅ Dashboard'a yönlendir
            console.log('LoginForm: navigating to /dashboard');
            try {
                router.replace('/dashboard');
            } catch (navErr) {
                console.error('LoginForm: router.replace error', navErr);
                setError('Yönlendirme sırasında hata oluştu');
            }

        } catch (err: any) {
            console.error('LoginForm: caught error', err);

            if (err.code === 'auth/invalid-credential') {
                setError('E-posta veya şifre hatalı');
            } else {
                setError(err.message || 'Giriş yapılamadı');
            }
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem',
        background: '#16161f',
        border: '1px solid #2a2a3a',
        borderRadius: '0.875rem',
        color: '#e8e8f0',
        fontSize: '0.875rem'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#d1d5db',
        marginBottom: '0.5rem'
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
                <div style={{
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#f87171',
                    borderRadius: '0.875rem'
                }}>
                    {error}
                </div>
            )}

            <div>
                <label style={labelStyle}>Kullanıcı Adı</label>
                <input name="username" type="email" required style={inputStyle} />
            </div>

            <div>
                <label style={labelStyle}>Şifre</label>
                <input name="password" type="password" required style={inputStyle} />
            </div>

            <div>
                <label style={labelStyle}>Çalışma Yılı</label>
                <select name="year" defaultValue={currentYear} style={inputStyle}>
                    {years.map(y => <option key={y}>{y}</option>)}
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                    padding: '0.875rem',
                    borderRadius: '0.875rem',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Giriş Yapılıyor...' : <>Giriş Yap <LogIn size={18} /></>}
            </button>
        </form>
    );
}
