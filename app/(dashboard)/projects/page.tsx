import { getProjects } from '@/services/projectService';
import ProjectFilters from '@/components/ProjectFilters';
import ProjectStatusToggle from '@/components/ProjectStatusToggle';
import Link from 'next/link';
import { Plus, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const q = typeof params.q === 'string' ? params.q : undefined;
    const status = typeof params.status === 'string' ? params.status : undefined;

    const projects = await getProjects({
        search: q,
        status: status,
    });

    const getStatusBadge = (status: string) => {
        const styles = {
            Open: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
            InProgress: { bg: 'rgba(5, 150, 105, 0.15)', color: '#10b981', border: 'rgba(5, 150, 105, 0.3)' },
            Completed: { bg: 'rgba(4, 120, 87, 0.15)', color: '#059669', border: 'rgba(4, 120, 87, 0.3)' },
            Delayed: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
        } as Record<string, any>;

        const labels = {
            Open: 'Açık',
            InProgress: 'Devam Ediyor',
            Completed: 'Tamamlandı',
            Delayed: 'Gecikmiş',
        } as Record<string, string>;

        const style = styles[status] || styles.Open;

        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.375rem 0.875rem',
                borderRadius: '0.625rem',
                fontSize: '0.813rem',
                fontWeight: 500,
                background: style.bg,
                color: style.color,
                border: `1px solid ${style.border}`
            }}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Projeler
                    </h1>
                    <p style={{ color: '#a0a0b8', fontSize: '0.875rem' }}>Proje portföyünü yönetin</p>
                </div>
                <Link href="/projects/new" style={{ textDecoration: 'none' }}>
                    <div className="btn-gradient" style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.875rem',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                        transition: 'all 0.3s ease'
                    }}>
                        <Plus size={20} />
                        Yeni Proje
                    </div>
                </Link>
            </div>

            {/* Filters */}
            <ProjectFilters />

            {/* Table Card */}
            <div style={{
                background: 'rgba(30, 30, 46, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '1.5rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table-dark" style={{
                        width: '100%',
                        borderCollapse: 'separate',
                        borderSpacing: 0
                    }}>
                        <thead>
                            <tr style={{ background: '#1a1a2a' }}>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>DURUM</th>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>PROJE</th>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>MÜŞTERİ</th>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>DEĞER</th>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>ZAMAN ÇİZELGESİ</th>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'right',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>İŞLEM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{
                                        padding: '3rem',
                                        textAlign: 'center',
                                        color: '#6b6b80'
                                    }}>
                                        Proje bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project.id} style={{
                                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                                        transition: 'background 0.2s'
                                    }}>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <ProjectStatusToggle id={project.id} status={project.status} />
                                                {getStatusBadge(project.status)}
                                            </div>
                                        </td>
                                        <td style={{
                                            padding: '1.25rem 1.5rem',
                                            fontWeight: 500,
                                            color: '#e8e8f0',
                                            textDecoration: project.status === 'Completed' ? 'line-through' : 'none',
                                            opacity: project.status === 'Completed' ? 0.5 : 1
                                        }}>
                                            {project.description || `Project #${project.id}`}
                                        </td>
                                        <td style={{
                                            padding: '1.25rem 1.5rem',
                                            color: '#a0a0b8'
                                        }}>
                                            {project.clientType === 'Individual' ? project.clientName : project.companyName}
                                        </td>
                                        <td style={{
                                            padding: '1.25rem 1.5rem',
                                            fontWeight: 600,
                                            color: '#e8e8f0'
                                        }}>
                                            {project.agreedPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                        </td>
                                        <td style={{
                                            padding: '1.25rem 1.5rem',
                                            fontSize: '0.813rem',
                                            color: '#6b6b80'
                                        }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <span>{format(new Date(project.startDate), 'd MMM yyyy', { locale: tr })}</span>
                                                <span>→ {format(new Date(project.endDate), 'd MMM yyyy', { locale: tr })}</span>
                                            </div>
                                        </td>
                                        <td style={{
                                            padding: '1.25rem 1.5rem',
                                            textAlign: 'right'
                                        }}>
                                            <Link href={`/projects/${project.id}`} style={{
                                                color: '#6b6b80',
                                                transition: 'color 0.2s',
                                                display: 'inline-block'
                                            }}>
                                                <ChevronRight size={20} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
