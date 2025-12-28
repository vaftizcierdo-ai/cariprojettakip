import { getProjectById } from '@/services/projectService';
import ProjectForm from '@/components/ProjectForm';
import { updateProject } from '@/actions/project';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
        return (
            <div style={{ color: '#e8e8f0', textAlign: 'center', marginTop: '4rem' }}>
                Proje bulunamadı.
            </div>
        );
    }

    const updateProjectWithId = updateProject.bind(null, project.id);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <Link href={`/dashboard/projects/${id}`} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#a0a0b8',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    transition: 'color 0.2s'
                }}>
                    <ArrowLeft size={16} />
                    Projeye Dön
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: '#e8e8f0'
                    }}>
                        Projeyi Düzenle
                    </h1>
                    <div style={{
                        padding: '0.25rem 0.75rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '999px',
                        color: '#60a5fa',
                        fontSize: '0.75rem',
                        fontWeight: 600
                    }}>
                        {project.description}
                    </div>
                </div>
                <p style={{ color: '#a0a0b8', marginTop: '0.5rem' }}>
                    Proje bilgilerini güncelleyin ve kaydedin.
                </p>
            </div>

            <ProjectForm project={project} action={updateProjectWithId} />
        </div>
    );
}
