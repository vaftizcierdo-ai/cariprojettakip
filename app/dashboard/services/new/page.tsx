import ServiceForm from '@/components/ServiceForm';
import { getProjects } from '@/services/projectService';

export default async function NewServicePage() {
    const projects = await getProjects();

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    New Service Request
                </h1>
                <p style={{ color: '#a0a0b8', fontSize: '0.875rem' }}>Create a service record for an existing project</p>
            </div>

            <ServiceForm projects={projects} />
        </div>
    );
}
