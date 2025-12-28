'use client';

import { useState, useEffect } from 'react';
import ServiceFilters from '@/components/ServiceFilters';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Service {
    id: number;
    description: string;
    complaintDate: string;
    status: string;
    resolutionDate: string | null;
    project: {
        id: number;
        description: string | null;
        clientName: string | null;
        companyName: string | null;
    };
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            const data = await res.json();
            setServices(data);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (serviceId: number) => {
        setCompletedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(serviceId)) {
                newSet.delete(serviceId);
            } else {
                newSet.add(serviceId);
            }
            return newSet;
        });
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            Open: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
            InProgress: { bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' },
            Solved: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
        } as Record<string, any>;

        const labels = {
            Open: 'Açık',
            InProgress: 'İşlemde',
            Solved: 'Çözüldü',
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
                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Servis Talepleri
                    </h1>
                    <p style={{ color: '#a0a0b8', fontSize: '0.875rem' }}>Müşteri şikayetleri ve servis takibi</p>
                </div>
                <Link href="/dashboard/services/new" style={{ textDecoration: 'none' }}>
                    <div className="btn-gradient" style={{
                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.875rem',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 20px rgba(250, 112, 154, 0.4)',
                        transition: 'all 0.3s ease'
                    }}>
                        <Plus size={20} />
                        Yeni Talep
                    </div>
                </Link>
            </div>

            {/* Filters */}
            <ServiceFilters />

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
                                    textAlign: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80',
                                    width: '60px'
                                }}>✓</th>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>Durum</th>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>Proje / Müşteri</th>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>Açıklama</th>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>Tarih</th>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>Çözüm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} style={{
                                        padding: '3rem',
                                        textAlign: 'center',
                                        color: '#6b6b80'
                                    }}>
                                        Yükleniyor...
                                    </td>
                                </tr>
                            ) : services.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{
                                        padding: '3rem',
                                        textAlign: 'center',
                                        color: '#6b6b80'
                                    }}>
                                        Servis talebi bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                services.map((service) => {
                                    const isCompleted = completedItems.has(service.id);
                                    return (
                                        <tr key={service.id} style={{
                                            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                                            background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                                            transition: 'background 0.3s ease'
                                        }}>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                textAlign: 'center'
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={isCompleted}
                                                    onChange={() => handleCheckboxChange(service.id)}
                                                    style={{
                                                        width: '18px',
                                                        height: '18px',
                                                        cursor: 'pointer',
                                                        accentColor: '#34d399'
                                                    }}
                                                />
                                            </td>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                textDecoration: isCompleted ? 'line-through' : 'none'
                                            }}>
                                                {getStatusBadge(service.status)}
                                            </td>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                textDecoration: isCompleted ? 'line-through' : 'none'
                                            }}>
                                                <div style={{ fontWeight: 500, color: '#e8e8f0', marginBottom: '0.25rem' }}>
                                                    {service.project?.description || `Proje #${service.project?.id}`}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b6b80' }}>
                                                    {service.project?.clientName || service.project?.companyName || '-'}
                                                </div>
                                            </td>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                color: '#a0a0b8',
                                                maxWidth: '300px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                textDecoration: isCompleted ? 'line-through' : 'none'
                                            }} title={service.description}>
                                                {service.description}
                                            </td>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                fontSize: '0.813rem',
                                                color: '#6b6b80',
                                                whiteSpace: 'nowrap',
                                                textDecoration: isCompleted ? 'line-through' : 'none'
                                            }}>
                                                {format(new Date(service.complaintDate), 'd MMM yyyy', { locale: tr })}
                                            </td>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                fontSize: '0.813rem',
                                                color: '#6b6b80',
                                                textDecoration: isCompleted ? 'line-through' : 'none'
                                            }}>
                                                {service.resolutionDate ? (
                                                    <span style={{ color: '#34d399', fontWeight: 500 }}>
                                                        {format(new Date(service.resolutionDate), 'd MMM', { locale: tr })}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
