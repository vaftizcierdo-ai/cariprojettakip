//app/(auth)/login/page

import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0f',
            position: 'relative',
            overflow: 'hidden',
            padding: '1rem'
        }}>
            {/* Background Effects */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '500px',
                height: '500px',
                background: 'rgba(16, 185, 129, 0.15)',
                borderRadius: '50%',
                filter: 'blur(120px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-10%',
                width: '500px',
                height: '500px',
                background: 'rgba(5, 150, 105, 0.1)',
                borderRadius: '50%',
                filter: 'blur(120px)',
                pointerEvents: 'none'
            }} />

            <div style={{
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    background: 'rgba(30, 30, 46, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    padding: '2.5rem'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{
                            fontSize: '1.875rem',
                            fontWeight: 700,
                            background: 'linear-gradient(to right, #34d399, #10b981)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '0.5rem'
                        }}>
                            Proje & Ödeme Takip
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Giriş Yapın</p>
                    </div>
                    <LoginForm />
                </div>

                <div style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    color: '#64748b',
                    fontSize: '0.875rem'
                }}>
                    © {new Date().getFullYear()} CRM Sistemi v1.0
                </div>
            </div>
        </div>
    );
}
