import PaymentForm from '@/components/PaymentForm';

export default async function NewPaymentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Ödeme Ekle
                </h1>
                <p style={{ color: '#a0a0b8', fontSize: '0.875rem' }}>Bu proje için yeni bir ödeme kaydedin</p>
            </div>

            <PaymentForm projectId={id} />
        </div>
    );
}
