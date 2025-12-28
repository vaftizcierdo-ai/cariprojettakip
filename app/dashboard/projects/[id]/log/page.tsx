import LogForm from '@/components/LogForm';

export default async function NewLogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Gelişme Ekle
                </h1>
                <p style={{ color: '#a0a0b8', fontSize: '0.875rem' }}>Projeye yeni bir gelişme notu ekleyin</p>
            </div>

            <LogForm projectId={id} />
        </div>
    );
}
