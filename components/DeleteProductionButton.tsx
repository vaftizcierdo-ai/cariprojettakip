'use client';

import { deleteProductionJob } from '@/app/actions/production';
import { Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';

export default function DeleteProductionButton({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = () => {
        startTransition(async () => {
            await deleteProductionJob(id);
        });
    };

    if (showConfirm) {
        return (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.813rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        opacity: isPending ? 0.7 : 1,
                        flex: 1
                    }}
                >
                    {isPending ? '...' : 'Evet, Sil'}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isPending}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#a0a0b8',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.813rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        flex: 1
                    }}
                >
                    İptal
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.625rem',
                borderRadius: '0.625rem',
                fontSize: '0.813rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
            }}
        >
            <Trash2 size={14} />
            Sil
        </button>
    );
}
