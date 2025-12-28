import { getProjectById } from '@/services/projectService';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CreditCard, FileText, Edit2, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import DeleteProjectButton from '@/components/DeleteProjectButton';

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProjectById(parseInt(id));

    if (!project) {
        notFound();
    }

    const totalPaid = project.payments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = project.agreedPrice - totalPaid;

    const getStatusBadge = (status: string) => {
        const styles = {
            Open: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
            InProgress: { bg: 'rgba(5, 150, 105, 0.15)', color: '#10b981', border: 'rgba(5, 150, 105, 0.3)' },
            Completed: { bg: 'rgba(4, 120, 87, 0.15)', color: '#059669', border: 'rgba(4, 120, 87, 0.3)' },
            Delayed: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
        } as Record<string, any>;

        const style = styles[status] || styles.Open;

        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.375rem 0.875rem',
                borderRadius: '0.625rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: style.bg,
                color: style.color,
                border: `1px solid ${style.border}`
            }}>
                {status}
            </span>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
            }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h1 style={{
                                fontSize: '2rem',
                                fontWeight: 700,
                                color: '#e8e8f0'
                            }}>
                                {project.description}
                            </h1>
                            {getStatusBadge(project.status)}
                        </div>
                        <p style={{ color: '#a0a0b8', fontSize: '0.875rem' }}>
                            {project.clientType === 'Individual' ? project.clientName : project.companyName} • {project.city}/{project.district}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <DeleteProjectButton id={project.id} />
                        <Link href={`/projects/${id}/edit`} style={{ textDecoration: 'none' }}>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#e8e8f0',
                                padding: '0.625rem 1.25rem',
                                borderRadius: '0.75rem',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                                <Edit2 size={16} />
                                Düzenle
                            </button>
                        </Link>
                        <Link href={`/projects/${id}/log`} style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                color: 'white',
                                padding: '0.625rem 1.25rem',
                                borderRadius: '0.75rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                                transition: 'all 0.3s ease'
                            }}>
                                <FileText size={16} />
                                Gelişme Ekle
                            </div>
                        </Link>
                        <Link href={`/projects/${id}/payment`} style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                                color: 'white',
                                padding: '0.625rem 1.25rem',
                                borderRadius: '0.75rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)',
                                transition: 'all 0.3s ease'
                            }}>
                                <CreditCard size={16} />
                                Ödeme Ekle
                            </div>
                        </Link>
                        <Link href={`/projects/${id}/expense`} style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                color: 'white',
                                padding: '0.625rem 1.25rem',
                                borderRadius: '0.75rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                                transition: 'all 0.3s ease'
                            }}>
                                <TrendingDown size={16} />
                                Gider Ekle
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                {/* Financial Stats */}
                <div style={{
                    gridColumn: '1 / -1',
                    background: 'rgba(30, 30, 46, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '1.5rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    padding: '2rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem'
                }}>
                    <div>
                        <p style={{ fontSize: '0.813rem', fontWeight: 500, color: '#6b6b80', marginBottom: '0.5rem' }}>Anlaşılan Fiyat</p>
                        <p style={{ fontSize: '1.875rem', fontWeight: 700, color: '#e8e8f0' }}>
                            {project.agreedPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </p>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.813rem', fontWeight: 500, color: '#6b6b80', marginBottom: '0.5rem' }}>Toplam Ödenen</p>
                        <p style={{ fontSize: '1.875rem', fontWeight: 700, color: '#34d399' }}>
                            {totalPaid.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </p>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.813rem', fontWeight: 500, color: '#6b6b80', marginBottom: '0.5rem' }}>Kalan</p>
                        <p style={{ fontSize: '1.875rem', fontWeight: 700, color: '#f87171' }}>
                            {remaining.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </p>
                    </div>
                </div>

                {/* Payment History */}
                <div style={{
                    gridColumn: '1 / -1',
                    background: 'rgba(30, 30, 46, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '1.5rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontWeight: 600, color: '#e8e8f0' }}>
                        Ödeme ve Gider Geçmişi
                    </div>
                    <div>
                        {(project.payments?.length === 0 && project.expenses?.length === 0) ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#6b6b80', fontSize: '0.875rem' }}>
                                Henüz ödeme veya gider yok.
                            </div>
                        ) : (
                            <>
                                {/* Payments */}
                                {project.payments?.map((payment: any) => (
                                    <div key={`payment-${payment.id}`} style={{
                                        padding: '1.25rem 1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <div>
                                            <p style={{ fontWeight: 500, color: '#e8e8f0', marginBottom: '0.25rem' }}>
                                                {payment.description || 'Ödeme'}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: '#6b6b80' }}>
                                                {format(new Date(payment.date), 'd MMMM yyyy', { locale: tr })} • {payment.type}
                                            </p>
                                        </div>
                                        <span style={{ fontWeight: 700, color: '#34d399', fontSize: '1.125rem' }}>
                                            +{payment.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                        </span>
                                    </div>
                                ))}
                                {/* Expenses */}
                                {project.expenses?.map((expense: any) => (
                                    <div key={`expense-${expense.id}`} style={{
                                        padding: '1.25rem 1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                        background: 'rgba(239, 68, 68, 0.03)'
                                    }}>
                                        <div>
                                            <p style={{ fontWeight: 500, color: '#e8e8f0', marginBottom: '0.25rem' }}>
                                                {expense.description || 'Gider'}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: '#6b6b80' }}>
                                                {format(new Date(expense.date), 'd MMMM yyyy', { locale: tr })} • {expense.category}
                                            </p>
                                        </div>
                                        <span style={{ fontWeight: 700, color: '#f87171', fontSize: '1.125rem' }}>
                                            -{expense.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                        </span>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* Client Details */}
                <div style={{
                    background: 'rgba(30, 30, 46, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '1.5rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    padding: '1.5rem'
                }}>
                    <h3 style={{ fontWeight: 700, color: '#e8e8f0', marginBottom: '1.5rem' }}>Müşteri Detayları</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <span style={{ color: '#6b6b80' }}>Müşteri</span>
                            <span style={{ fontWeight: 500, color: '#e8e8f0', textAlign: 'right' }}>{project.clientName || project.companyName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <span style={{ color: '#6b6b80' }}>Telefon</span>
                            <span style={{ fontWeight: 500, color: '#e8e8f0', textAlign: 'right' }}>{project.phone || '-'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <span style={{ color: '#6b6b80' }}>E-posta</span>
                            <span style={{ fontWeight: 500, color: '#e8e8f0', textAlign: 'right' }}>{project.email || '-'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#6b6b80' }}>Konum</span>
                            <span style={{ fontWeight: 500, color: '#e8e8f0', textAlign: 'right' }}>{project.city} / {project.district}</span>
                        </div>
                    </div>
                </div>

                {/* Project Timeline */}
                <div style={{
                    background: 'rgba(30, 30, 46, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '1.5rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    padding: '1.5rem'
                }}>
                    <h3 style={{ fontWeight: 700, color: '#e8e8f0', marginBottom: '1.5rem' }}>Proje Akışı</h3>
                    <div style={{ position: 'relative', borderLeft: '2px sold rgba(255, 255, 255, 0.1)', marginLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {project.logs.length === 0 ? (
                            <p style={{ paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#6b6b80' }}>Henüz gelişme notu yok.</p>
                        ) : (
                            project.logs.map(log => (
                                <div key={log.id} style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: '-0.375rem',
                                        top: '0.375rem',
                                        width: '0.75rem',
                                        height: '0.75rem',
                                        borderRadius: '50%',
                                        background: 'rgba(148, 163, 184, 0.3)',
                                        border: '2px solid #1e1e2e'
                                    }}></div>
                                    <p style={{ fontSize: '0.875rem', color: '#e8e8f0', marginBottom: '0.25rem' }}>{log.content}</p>
                                    <span style={{ fontSize: '0.75rem', color: '#6b6b80' }}>
                                        {format(new Date(log.createdAt), 'd MMM HH:mm', { locale: tr })}
                                    </span>
                                </div>
                            ))
                        )}
                        <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                            <div style={{
                                position: 'absolute',
                                left: '-0.375rem',
                                top: '0.375rem',
                                width: '0.75rem',
                                height: '0.75rem',
                                borderRadius: '50%',
                                background: 'rgba(16, 185, 129, 0.3)',
                                border: '2px solid #1e1e2e'
                            }}></div>
                            <p style={{ fontSize: '0.875rem', color: '#6b6b80', marginBottom: '0.25rem' }}>Proje Bitiş (Planlanan)</p>
                            <span style={{ fontSize: '0.75rem', color: '#6b6b80' }}>{format(new Date(project.endDate), 'd MMM yyyy', { locale: tr })}</span>
                        </div>
                        <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                            <div style={{
                                position: 'absolute',
                                left: '-0.375rem',
                                top: '0.375rem',
                                width: '0.75rem',
                                height: '0.75rem',
                                borderRadius: '50%',
                                background: 'rgba(5, 150, 105, 0.3)',
                                border: '2px solid #1e1e2e'
                            }}></div>
                            <p style={{ fontSize: '0.875rem', color: '#6b6b80', marginBottom: '0.25rem' }}>Proje Başlangıç</p>
                            <span style={{ fontSize: '0.75rem', color: '#6b6b80' }}>{format(new Date(project.startDate), 'd MMM yyyy', { locale: tr })}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
