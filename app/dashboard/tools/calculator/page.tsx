export default function CalculatorPage() {
    return (
        <div style={{
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <div style={{
                background: 'rgba(30, 30, 46, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1.5rem',
                padding: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    background: 'linear-gradient(to right, #34d399, #10b981)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Hesap Makinesi
                </h1>
                <p style={{ color: '#a0a0b8', fontSize: '1rem' }}>
                    Bu araç için içerik yakında eklenecek.
                </p>
            </div>
        </div>
    );
}
