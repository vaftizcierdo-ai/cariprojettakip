import { getOrCreateFinancialSnapshot } from '@/services/financialService';
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Receipt, PiggyBank } from 'lucide-react';
import YearSelect from '@/components/YearSelect';

export default async function FinancialStatusPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const now = new Date();
    const currentYear = now.getFullYear();

    // ✅ Promise olduğu için await şart
    const params = await searchParams;

    const yearRaw = params.year;
    const yearStr = Array.isArray(yearRaw) ? yearRaw[0] : yearRaw;

    const selectedYear =
        yearStr && /^\d{4}$/.test(yearStr) ? Number(yearStr) : currentYear;

    // ✅ Snapshot'tan oku / yoksa hesapla + kaydet
    const snap = await getOrCreateFinancialSnapshot(selectedYear);

    const { summary, monthlyData, projectProfitability } = snap;

    // ✅ sadece seçilen yıl current year ise mevcut aya kadar göster
    const currentMonth = now.getMonth() + 1;
    const relevantMonths =
        selectedYear === currentYear
            ? monthlyData.filter((m: any) => m.month <= currentMonth)
            : monthlyData;

    const formatCurrency = (value: number) =>
        (value || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });

    const cardStyle = {
        background: 'rgba(30, 30, 46, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        padding: '1.5rem',
    } as const;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#e8e8f0', marginBottom: '0.5rem' }}>
                        Mali Durum
                    </h1>
                    <p style={{ color: '#a0a0b8', fontSize: '0.875rem' }}>
                        {selectedYear} Yılı Mali Analizi
                    </p>
                </div>

                {/* Sağ tarafta yıl seçici */}
                <YearSelect currentYear={currentYear} selectedYear={selectedYear} />
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6b6b80', marginBottom: '0.25rem' }}>Proje Sayısı</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e8e8f0' }}>{summary.projectCount}</p>
                        </div>
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '1rem', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <DollarSign size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6b6b80', marginBottom: '0.25rem' }}>Toplam Anlaşma</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e8e8f0' }}>{formatCurrency(summary.totalAgreedPrice)}</p>
                        </div>
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '1rem', background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingUp size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6b6b80', marginBottom: '0.25rem' }}>Alınan Ödemeler</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>{formatCurrency(summary.totalPayments)}</p>
                        </div>
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '1rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Receipt size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6b6b80', marginBottom: '0.25rem' }}>Kalan Ödemeler</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>{formatCurrency(summary.remainingPayments)}</p>
                        </div>
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '1rem', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingDown size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6b6b80', marginBottom: '0.25rem' }}>Toplam Gider</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f87171' }}>{formatCurrency(summary.totalExpenses)}</p>
                        </div>
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: '1rem',
                            background: summary.netProfit >= 0
                                ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <PiggyBank size={24} color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#6b6b80', marginBottom: '0.25rem' }}>Net Kâr</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: summary.netProfit >= 0 ? '#22c55e' : '#f87171' }}>
                                {formatCurrency(summary.netProfit)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Aylık Analiz */}
            <div style={{ ...cardStyle, overflow: 'hidden', padding: 0 }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontWeight: 600, color: '#e8e8f0', fontSize: '1.125rem' }}>
                    Aylık Analiz
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem' }}>Ay</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem' }}>Proje</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem' }}>Anlaşma</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem' }}>Ödeme</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem' }}>Gider</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem' }}>Net</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relevantMonths.map((month: any) => (
                                <tr key={month.month} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <td style={{ padding: '1rem 1.5rem', color: '#e8e8f0', fontWeight: 500, textTransform: 'capitalize' }}>{month.monthName}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center', color: '#e8e8f0' }}>{month.projectCount}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#e8e8f0' }}>{formatCurrency(month.totalAgreed)}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#34d399' }}>{formatCurrency(month.paymentsReceived)}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#f87171' }}>{formatCurrency(month.expensesTotal)}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: month.netProfit >= 0 ? '#22c55e' : '#f87171' }}>
                                        {formatCurrency(month.netProfit)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Proje Kârlılığı */}
            <div style={{ ...cardStyle, overflow: 'hidden', padding: 0 }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontWeight: 600, color: '#e8e8f0', fontSize: '1.125rem' }}>
                    Proje Kârlılığı
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem' }}>Proje</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem' }}>Müşteri</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem' }}>Anlaşma</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem' }}>Ödeme</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem' }}>Gider</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem' }}>Kâr</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: '#a0a0b8', fontSize: '0.75rem' }}>Marj</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectProfitability.map((project: any) => (
                                <tr key={project.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <td style={{ padding: '1rem 1.5rem', color: '#e8e8f0', fontWeight: 500 }}>{project.description}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#a0a0b8' }}>{project.clientName}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#e8e8f0' }}>{formatCurrency(project.agreedPrice)}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#34d399' }}>{formatCurrency(project.totalPayments)}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#f87171' }}>{formatCurrency(project.totalExpenses)}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: project.profit >= 0 ? '#22c55e' : '#f87171' }}>
                                        {formatCurrency(project.profit)}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: Number(project.profitMargin) >= 0 ? '#34d399' : '#f87171' }}>
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
