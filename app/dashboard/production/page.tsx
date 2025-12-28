import { getProductionJobs } from '@/services/productionService';
import ProductionFilters from '@/components/ProductionFilters';
import DeleteProductionButton from '@/components/DeleteProductionButton';
import Link from 'next/link';
import { Plus, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default async function ProductionPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const type = typeof params.type === 'string' ? params.type : undefined;

    const jobs = await getProductionJobs(type);

    const getStatusBadge = (status: string) => {
        const styles = {
            Waiting: { bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' },
            InProduction: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
            Finished: { bg: 'rgba(5, 150, 105, 0.15)', color: '#10b981', border: 'rgba(5, 150, 105, 0.3)' },
        } as Record<string, any>;

        const labels = {
            Waiting: 'Bekliyor',
            InProduction: 'Üretimde',
            Finished: 'Tamamlandı',
        } as Record<string, string>;

        const style = styles[status] || styles.Waiting;

        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.25rem 0.625rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                background: style.bg,
                color: style.color,
                border: `1px solid ${style.border}`
            }}>
                {labels[status] || status}
            </span>
        );
    };

    const getTypeBadge = (type: string) => {
        const typeLabels: Record<string, string> = {
            'Pergola': 'Pergole',
            'Sliding': 'Sürme Cam',
            'Giyotin': 'Giyotin Cam',
            'Fixed': 'Sabit Doğrama',
            'Roll-Bio': 'Roll-Bio',
            'Zip-Wint': 'Zip-Wint',
        };

        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.25rem 0.625rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
                {typeLabels[type] || type}
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
                        Üretim Takibi
                    </h1>
                    <p style={{ color: '#a0a0b8', fontSize: '0.875rem' }}>Kategorize edilmiş üretim süreçleri</p>
                </div>
                <Link href="/dashboard/production/new" style={{ textDecoration: 'none' }}>
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
                        Yeni Üretim Ekle
                    </div>
                </Link>
            </div>

            {/* Filters */}
            <ProductionFilters />

            {/* Production Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
            }}>
                {jobs.length === 0 ? (
                    <div style={{
                        gridColumn: '1 / -1',
                        background: 'rgba(30, 30, 46, 0.6)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '1.5rem',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        padding: '3rem',
                        textAlign: 'center',
                        color: '#6b6b80'
                    }}>
                        Bu kategoride üretim bulunamadı.
                    </div>
                ) : (
                    jobs.map(job => (
                        <div key={job.id} style={{
                            background: 'rgba(30, 30, 46, 0.6)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '1.5rem',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.3s ease'
                        }}>
                            {/* Card Header */}
                            <div style={{
                                padding: '1.5rem',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '0.75rem',
                                    marginBottom: '0.75rem'
                                }}>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        color: '#e8e8f0',
                                        flex: 1,
                                        lineHeight: 1.4
                                    }}>
                                        {job.project.description || `Project #${job.project.id}`}
                                    </h3>
                                    {getStatusBadge(job.status)}
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center',
                                    marginBottom: '0.5rem'
                                }}>
                                    {getTypeBadge(job.type)}
                                </div>

                                <p style={{
                                    fontSize: '0.813rem',
                                    color: '#6b6b80',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem'
                                }}>
                                    <MapPin size={12} />
                                    {job.project.clientName || job.project.companyName}
                                    {job.project.city && ` • ${job.project.city}`}
                                </p>
                            </div>

                            {/* Card Body */}
                            <div style={{
                                padding: '1.5rem',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                {job.description && (
                                    <p style={{
                                        fontSize: '0.813rem',
                                        color: '#a0a0b8',
                                        lineHeight: 1.6,
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        padding: '0.75rem',
                                        borderRadius: '0.625rem',
                                        border: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        {job.description}
                                    </p>
                                )}

                                {/* Dates */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                    fontSize: '0.75rem',
                                    color: '#6b6b80',
                                    paddingTop: '0.5rem',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={12} />
                                        <span>Sipariş: {format(new Date(job.orderDate), 'd MMMM yyyy', { locale: tr })}</span>
                                    </div>
                                    {job.estimatedEndDate && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: new Date() > new Date(job.estimatedEndDate) && job.status !== 'Finished' ? '#f87171' : '#6b6b80',
                                            fontWeight: new Date() > new Date(job.estimatedEndDate) && job.status !== 'Finished' ? 600 : 400
                                        }}>
                                            <Clock size={12} />
                                            <span>Bitiş: {format(new Date(job.estimatedEndDate), 'd MMMM yyyy', { locale: tr })}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div style={{
                                padding: '1rem 1.5rem',
                                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>
                                <DeleteProductionButton id={job.id} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
