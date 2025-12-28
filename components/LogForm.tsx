'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { addLog } from '@/actions/log';
import { Save } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: pending ? 'rgba(52, 211, 153, 0.5)' : 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.875rem',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: pending ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(52, 211, 153, 0.4)',
                transition: 'all 0.3s ease'
            }}
        >
            <Save size={20} />
            {pending ? 'Ekleniyor...' : 'Not Ekle'}
        </button>
    );
}

export default function LogForm({ projectId }: { projectId: number }) {
    const [state, formAction] = useActionState(addLog, null);

    const textareaStyle = {
        width: '100%',
        padding: '0.875rem 1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0.75rem',
        color: '#e8e8f0',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'all 0.2s',
        resize: 'vertical' as const,
        fontFamily: 'inherit',
        lineHeight: 1.6
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.813rem',
        fontWeight: 500,
        color: '#a0a0b8',
        marginBottom: '0.5rem'
    };

    return (
        <form action={formAction} style={{
            background: 'rgba(30, 30, 46, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        }}>
            <input type="hidden" name="projectId" value={projectId} />

            {state?.error && (
                <div style={{
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#f87171',
                    fontSize: '0.875rem'
                }}>
                    {state.error}
                </div>
            )}

            <div>
                <label style={labelStyle}>Gelişme Notu *</label>
                <textarea
                    name="content"
                    rows={6}
                    required
                    placeholder="Örn: Cam siparişleri geçildi..."
                    style={textareaStyle}
                    onFocus={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.5)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <SubmitButton />
            </div>
        </form>
    );
}
