import { getProjectById } from '@/services/projectService';
import { notFound } from 'next/navigation';
import ExpenseForm from '@/components/ExpenseForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AddExpensePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
        notFound();
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href={`/dashboard/projects/${id}`} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#a0a0b8',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    marginBottom: '1rem'
                }}>
                    <ArrowLeft size={16} />
                    Projeye Dön
                </Link>
                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: '#e8e8f0',
                    marginBottom: '0.5rem'
                }}>
                    Gider Ekle
                </h1>
                <p style={{ color: '#a0a0b8', fontSize: '0.875rem' }}>
                    {project.description} - {project.clientName || project.companyName}
                </p>
            </div>

            <ExpenseForm projectId={project.id} />
        </div>
    );
}
