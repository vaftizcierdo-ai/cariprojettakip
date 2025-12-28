import { getGlassOrders } from '@/services/glassOrderService';
import GlassOrderToggle from '@/components/GlassOrderToggle';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default async function GlassOrdersPage() {
    const orders = await getGlassOrders();

    const getStatusBadge = (status: string) => {
        const styles = {
            Ordered: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
            InProgress: { bg: 'rgba(5, 150, 105, 0.15)', color: '#10b981', border: 'rgba(5, 150, 105, 0.3)' },
            Delivered: { bg: 'rgba(4, 120, 87, 0.15)', color: '#059669', border: 'rgba(4, 120, 87, 0.3)' },
        } as Record<string, any>;

        const labels = {
            Ordered: 'Sipariş Verildi',
            InProgress: 'Üretimde',
            Delivered: 'Teslim Edildi',
        } as Record<string, string>;

        const style = styles[status] || styles.Ordered;

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
                        Cam Siparişleri
                    </h1>
                    <p style={{ color: '#a0a0b8', fontSize: '0.875rem' }}>Cam siparişlerini ve teslimatlarını takip et</p>
                </div>
                <Link href="/glass-orders/new" style={{ textDecoration: 'none' }}>
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
                        Yeni Sipariş
                    </div>
                </Link>
            </div>

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
                                    color: '#6b6b80',
                                    width: '50px'
                                }}></th>
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
                                }}>PROJE / MÜŞTERİ</th>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>TEDARİKÇİ</th>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>SİPARİŞ KODU</th>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>TESLİM TARİHİ</th>
                                <th style={{
                                    padding: '1rem 1.5rem',
                                    textAlign: 'right',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80'
                                }}>DETAYLAR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{
                                        padding: '3rem',
                                        textAlign: 'center',
                                        color: '#6b6b80'
                                    }}>
                                        Cam siparişi bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const completed = (order as any).completed || false;
                                    return (
                                        <tr key={order.id} style={{
                                            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                                        }}>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <GlassOrderToggle id={order.id} completed={completed} />
                                            </td>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                textDecoration: completed ? 'line-through' : 'none',
                                                opacity: completed ? 0.5 : 1
                                            }}>
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                textDecoration: completed ? 'line-through' : 'none',
                                                opacity: completed ? 0.5 : 1
                                            }}>
                                                <div style={{ fontWeight: 500, color: '#e8e8f0', marginBottom: '0.25rem' }}>
                                                    {order.project.description || `Project #${order.project.id}`}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b6b80' }}>
                                                    {order.project.clientName || order.project.companyName}
                                                </div>
                                            </td>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                color: '#a0a0b8',
                                                textDecoration: completed ? 'line-through' : 'none',
                                                opacity: completed ? 0.5 : 1
                                            }}>
                                                {order.supplier || '-'}
                                            </td>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                fontSize: '0.813rem',
                                                color: '#a0a0b8',
                                                textDecoration: completed ? 'line-through' : 'none',
                                                opacity: completed ? 0.5 : 1
                                            }}>
                                                {(order as any).supplierOrderCode || '-'}
                                            </td>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                fontSize: '0.813rem',
                                                color: '#6b6b80',
                                                whiteSpace: 'nowrap',
                                                textDecoration: completed ? 'line-through' : 'none',
                                                opacity: completed ? 0.5 : 1
                                            }}>
                                                {(order as any).supplierDeliveryDate
                                                    ? format(new Date((order as any).supplierDeliveryDate), 'd MMM yyyy', { locale: tr })
                                                    : '-'}
                                            </td>
                                            <td style={{
                                                padding: '1.25rem 1.5rem',
                                                textAlign: 'right'
                                            }}>
                                                <Link href={`/glass-orders/${order.id}`} style={{
                                                    color: '#34d399',
                                                    fontSize: '0.813rem',
                                                    fontWeight: 500,
                                                    textDecoration: 'none',
                                                    transition: 'color 0.2s'
                                                }}>
                                                    Detayları Gör
                                                </Link>
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
