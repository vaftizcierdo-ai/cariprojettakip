import { getFinancialSummary, getMonthlyBreakdown, getProjectProfitability } from '@/services/financialService';
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Receipt, PiggyBank } from 'lucide-react';

export default async function FinancialStatusPage() {
    const currentYear = new Date().getFullYear();
    const summary = await getFinancialSummary(currentYear);
    const monthlyData = await getMonthlyBreakdown(currentYear);
    const projectProfitability = await getProjectProfitability(currentYear);

    // Filter to only show months up to current month
    const currentMonth = new Date().getMonth() + 1;
    const relevantMonths = monthlyData.filter(m => m.month <= currentMonth);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
    };

    const cardStyle = {
        background: 'rgba(30, 30, 46, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        padding: '1.5rem',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <div>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#e8e8f0',
                    marginBottom: '0.5rem'
                }}>
                    Mali Durum
                </h1>
                <p style={{ color: '#a0a0b8', fontSize: '0.875rem' }}>
                    {currentYear} Yılı Mali Analizi
                </p>
            </div>

            {/* Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem'
            }}>
                {/* Project Count */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '1rem',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Briefcase size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6b6b80', marginBottom: '0.25rem' }}>Proje Sayısı</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e8e8f0' }}>{summary.projectCount}</p>
                        </div>
                    </div>
                </div>

                {/* Total Agreed Price */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '1rem',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <DollarSign size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6b6b80', marginBottom: '0.25rem' }}>Toplam Anlaşma</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e8e8f0' }}>{formatCurrency(summary.totalAgreedPrice)}</p>
                        </div>
                    </div>
                </div>

                {/* Total Payments */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '1rem',
                            background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TrendingUp size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6b6b80', marginBottom: '0.25rem' }}>Alınan Ödemeler</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>{formatCurrency(summary.totalPayments)}</p>
                        </div>
                    </div>
                </div>

                {/* Remaining Payments */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '1rem',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Receipt size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6b6b80', marginBottom: '0.25rem' }}>Kalan Ödemeler</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>{formatCurrency(summary.remainingPayments)}</p>
                        </div>
                    </div>
                </div>

                {/* Total Expenses */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '1rem',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TrendingDown size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6b6b80', marginBottom: '0.25rem' }}>Toplam Gider</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f87171' }}>{formatCurrency(summary.totalExpenses)}</p>
                        </div>
                    </div>
                </div>

                {/* Net Profit */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '1rem',
                            background: summary.netProfit >= 0
                                ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <PiggyBank size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6b6b80', marginBottom: '0.25rem' }}>Net Kâr</p>
                            <p style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: summary.netProfit >= 0 ? '#22c55e' : '#f87171'
                            }}>
                                {formatCurrency(summary.netProfit)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Breakdown */}
            <div style={{
                ...cardStyle,
                overflow: 'hidden',
                padding: 0
            }}>
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    fontWeight: 600,
                    color: '#e8e8f0',
                    fontSize: '1.125rem'
                }}>
                    Aylık Analiz
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ay</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proje</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Anlaşma</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ödeme</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gider</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relevantMonths.map((month) => (
                                <tr key={month.month} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <td style={{ padding: '1rem 1.5rem', color: '#e8e8f0', fontWeight: 500, textTransform: 'capitalize' }}>{month.monthName}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center', color: '#e8e8f0' }}>{month.projectCount}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#e8e8f0' }}>{formatCurrency(month.totalAgreed)}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#34d399' }}>{formatCurrency(month.paymentsReceived)}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#f87171' }}>{formatCurrency(month.expensesTotal)}</td>
                                    <td style={{
                                        padding: '1rem 1.5rem',
                                        textAlign: 'right',
                                        fontWeight: 600,
                                        color: month.netProfit >= 0 ? '#22c55e' : '#f87171'
                                    }}>
                                        {formatCurrency(month.netProfit)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Project Profitability */}
            <div style={{
                ...cardStyle,
                overflow: 'hidden',
                padding: 0
            }}>
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    fontWeight: 600,
                    color: '#e8e8f0',
                    fontSize: '1.125rem'
                }}>
                    Proje Kârlılığı
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proje</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Müşteri</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Anlaşma</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ödeme</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gider</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kâr</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marj</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectProfitability.map((project) => (
                                <tr key={project.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <td style={{ padding: '1rem 1.5rem', color: '#e8e8f0', fontWeight: 500 }}>{project.description}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#a0a0b8' }}>{project.clientName}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#e8e8f0' }}>{formatCurrency(project.agreedPrice)}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#34d399' }}>{formatCurrency(project.totalPayments)}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#f87171' }}>{formatCurrency(project.totalExpenses)}</td>
                                    <td style={{
                                        padding: '1rem 1.5rem',
                                        textAlign: 'right',
                                        fontWeight: 600,
                                        color: project.profit >= 0 ? '#22c55e' : '#f87171'
                                    }}>
                                        {formatCurrency(project.profit)}
                                    </td>
                                    <td style={{
                                        padding: '1rem 1.5rem',
                                        textAlign: 'right',
                                        color: Number(project.profitMargin) >= 0 ? '#34d399' : '#f87171'
                                    }}>
                                        %{project.profitMargin}
                                    </td>
                                </tr>
                            ))}
                            {projectProfitability.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#6b6b80' }}>
                                        Bu yıl için henüz proje bulunmuyor.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
