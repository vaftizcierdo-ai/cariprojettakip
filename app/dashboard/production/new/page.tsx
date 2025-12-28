import ProductionForm from '@/components/ProductionForm';
import { getProjects } from '@/services/projectService';

export default async function NewProductionPage() {
    const projects = await getProjects();

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    New Production
                </h1>
                <p style={{ color: '#a0a0b8', fontSize: '0.875rem' }}>Add a new job to production list</p>
            </div>

            <ProductionForm projects={projects} />
        </div>
    );
}
