'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductionFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentType = searchParams.get('type') || '';

    const handleTypeChange = (type: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (type) {
            params.set('type', type);
        } else {
            params.delete('type');
        }
        router.push(`?${params.toString()}`);
    };

    const types = [
        { value: '', label: 'Tümü', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { value: 'Pergola', label: 'Pergole', gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' },
        { value: 'Sliding', label: 'Sürme Cam', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { value: 'Giyotin', label: 'Giyotin Cam', gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
        { value: 'Fixed', label: 'Sabit Doğrama', gradient: 'linear-gradient(135deg, #047857 0%, #065f46 100%)' },
        { value: 'Roll-Bio', label: 'Roll-Bio', gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' },
        { value: 'Zip-Wint', label: 'Zip-Wint', gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' },
    ];

    return (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {types.map((type) => {
                const isActive = currentType === type.value;
                return (
                    <button
                        key={type.value}
                        onClick={() => handleTypeChange(type.value)}
                        style={{
                            background: isActive ? type.gradient : 'rgba(255, 255, 255, 0.05)',
                            border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                            color: isActive ? 'white' : '#a0a0b8',
                            padding: '0.625rem 1.25rem',
                            borderRadius: '0.75rem',
                            fontSize: '0.875rem',
                            fontWeight: isActive ? 600 : 500,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.color = '#e8e8f0';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.color = '#a0a0b8';
                            }
                        }}
                    >
                        {type.label}
                    </button>
                );
            })}
        </div>
    );
}
