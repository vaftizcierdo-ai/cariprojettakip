'use client';

import { deleteProject } from '@/app/actions/project';
import { Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';

export default function DeleteProjectButton({ id }: { id: string | number }) {
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = () => {
        startTransition(async () => {
            await deleteProject(id);
        });
    };

    if (showConfirm) {
        return (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: 500 }}>
                    Emin misiniz?
                </span>
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        opacity: isPending ? 0.7 : 1
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
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
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
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.625rem 1.25rem',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
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
            <Trash2 size={16} />
            Projeyi Sil
        </button>
    );
}
