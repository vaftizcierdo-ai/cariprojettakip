import ProjectForm from '@/components/ProjectForm';

export default function NewProjectPage() {
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    New Project
                </h1>
                <p style={{ color: '#a0a0b8', fontSize: '0.875rem' }}>Create a new project record</p>
            </div>

            <ProjectForm />
        </div>
    );
}
