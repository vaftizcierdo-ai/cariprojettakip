'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/actions/auth';
import { LogIn } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1rem',
                borderRadius: '0.875rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'white',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                cursor: pending ? 'not-allowed' : 'pointer',
                opacity: pending ? 0.7 : 1,
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s ease'
            }}
        >
            {pending ? (
                <>
                    <svg style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem', height: '1rem', width: '1rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Giriş Yapılıyor...
                </>
            ) : (
                <>
                    Giriş Yap
                    <LogIn size={18} />
                </>
            )}
        </button>
    );
}

export default function LoginForm() {
    const [state, formAction] = useActionState(login, null);

    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];

    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem',
        background: '#16161f',
        border: '1px solid #2a2a3a',
        borderRadius: '0.875rem',
        color: '#e8e8f0',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'all 0.3s ease'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#d1d5db',
        marginBottom: '0.5rem'
    };

    return (
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {state?.error && (
                <div style={{
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#f87171',
                    fontSize: '0.875rem',
                    borderRadius: '0.875rem',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <svg style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span style={{ fontWeight: 500 }}>{state.error}</span>
                </div>
            )}

            <div>
                <label htmlFor="username" style={labelStyle}>
                    Kullanıcı Adı
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    style={inputStyle}
                    placeholder="Kullanıcı adınız"
                />
            </div>

            <div>
                <label htmlFor="password" style={labelStyle}>
                    Şifre
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    style={inputStyle}
                    placeholder="••••••"
                />
            </div>

            <div>
                <label htmlFor="year" style={labelStyle}>
                    Çalışma Yılı
                </label>
                <select
                    id="year"
                    name="year"
                    defaultValue={currentYear}
                    style={{
                        ...inputStyle,
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center'
                    }}
                >
                    {years.map(y => (
                        <option key={y} value={y} style={{ background: '#16161f', color: '#e8e8f0' }}>{y}</option>
                    ))}
                </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    style={{
                        width: '1rem',
                        height: '1rem',
                        accentColor: '#10b981',
                        cursor: 'pointer'
                    }}
                />
                <label htmlFor="remember-me" style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#9ca3af', cursor: 'pointer' }}>
                    Beni Hatırla
                </label>
            </div>

            <SubmitButton />
        </form>
    );
}
