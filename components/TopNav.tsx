'use client';

import { Search, DollarSign, Euro } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState, useEffect } from 'react';

export default function TopNav() {
    const router = useRouter();
    const [term, setTerm] = useState('');
    const [rates, setRates] = useState<{ usd: number | null; eur: number | null }>({ usd: null, eur: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                // Using a free exchange rate API
                const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const data = await res.json();
                const usdToTry = data.rates.TRY;
                const eurToTry = usdToTry / data.rates.EUR;
                setRates({ usd: usdToTry, eur: eurToTry });
            } catch (error) {
                console.error('Failed to fetch exchange rates:', error);
                // Fallback rates
                setRates({ usd: 35.20, eur: 37.50 });
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
        // Refresh every 5 minutes
        const interval = setInterval(fetchRates, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (term.trim()) {
            router.push(`/search?q=${encodeURIComponent(term)}`);
        }
    };

    const rateBoxStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.875rem',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '0.625rem',
        fontSize: '0.813rem',
        color: '#e8e8f0',
        fontWeight: 500
    };

    const iconStyle = {
        width: '1.25rem',
        height: '1.25rem',
        padding: '0.125rem',
        borderRadius: '0.25rem'
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            left: '280px',
            height: '70px',
            background: '#0a0a0f',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '1rem',
            paddingRight: '2rem',
            zIndex: 10
        }}>
            <form onSubmit={handleSearch} style={{ position: 'relative', width: '320px' }}>
                <input
                    type="text"
                    placeholder="Search anything..."
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.75rem',
                        color: '#e8e8f0',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                />
                <Search size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b6b80'
                }} />
            </form>

            {/* Currency Rates */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={rateBoxStyle}>
                    <DollarSign size={16} style={{ ...iconStyle, background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }} />
                    <span style={{ color: '#9ca3af' }}>USD/TRY</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>
                        {loading ? '...' : rates.usd?.toFixed(2)}
                    </span>
                </div>
                <div style={rateBoxStyle}>
                    <Euro size={16} style={{ ...iconStyle, background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }} />
                    <span style={{ color: '#9ca3af' }}>EUR/TRY</span>
                    <span style={{ color: '#3b82f6', fontWeight: 600 }}>
                        {loading ? '...' : rates.eur?.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
