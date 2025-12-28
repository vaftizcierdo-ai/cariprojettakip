'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function ProjectFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Initialize term from URL, but don't strictly bind it to suppress updates while typing
    const [term, setTerm] = useState(searchParams.get('q') || '');

    // Update local state if URL changes externally (e.g. navigation)
    useEffect(() => {
        const currentQ = searchParams.get('q') || '';
        if (currentQ !== term) {
            setTerm(currentQ);
        }
    }, [searchParams]);

    const handleSearch = (value: string) => {
        setTerm(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('q', value);
        } else {
            params.delete('q');
        }

        // Debounce the router push manually or use a library
        // Simple distinct timeout implementation
        const timeoutId = setTimeout(() => {
            router.push(`?${params.toString()}`);
        }, 500);
        return () => clearTimeout(timeoutId);
    };

    // We need a ref to keep track of the timeout to clear it
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTerm(value);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set('q', value);
            } else {
                params.delete('q');
            }
            router.push(`?${params.toString()}`);
        }, 500);
    };

    const currentStatus = searchParams.get('status') || '';

    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (status) {
            params.set('status', status);
        } else {
            params.delete('status');
        }
        router.push(`?${params.toString()}`);
    };

    const statuses = [
        { value: '', label: 'Tümü', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { value: 'Open', label: 'Açık', gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' },
        { value: 'InProgress', label: 'Devam Ediyor', gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
        { value: 'Completed', label: 'Tamamlandı', gradient: 'linear-gradient(135deg, #047857 0%, #065f46 100%)' },
        { value: 'Delayed', label: 'Gecikmiş', gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Search */}
            <div style={{ position: 'relative', maxWidth: '400px' }}>
                <input
                    type="text"
                    placeholder="Projelerde ara..."
                    value={term}
                    onChange={onSearchChange}
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
                        e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                />
                <Search size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b6b80'
                }} />
            </div>

            {/* Status Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {statuses.map((status) => {
                    const isActive = currentStatus === status.value;
                    return (
                        <button
                            key={status.value}
                            onClick={() => handleStatusChange(status.value)}
                            style={{
                                background: isActive ? status.gradient : 'rgba(255, 255, 255, 0.05)',
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
                            {status.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
