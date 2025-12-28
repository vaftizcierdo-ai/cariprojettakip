'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { addPayment } from '@/actions/payment';
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
                background: pending ? 'rgba(5, 150, 105, 0.5)' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.875rem',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: pending ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(5, 150, 105, 0.4)',
                transition: 'all 0.3s ease'
            }}
        >
            <Save size={20} />
            {pending ? 'Ekleniyor...' : 'Ödeme Ekle'}
        </button>
    );
}

export default function PaymentForm({ projectId }: { projectId: number }) {
    const [state, formAction] = useActionState(addPayment, null);

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0.75rem',
        color: '#e8e8f0',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'all 0.2s'
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
                <label style={labelStyle}>Tutar (TL) *</label>
                <input
                    type="number"
                    name="amount"
                    step="0.01"
                    required
                    style={inputStyle}
                    onFocus={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                />
            </div>

            <div>
                <label style={labelStyle}>Tarih *</label>
                <input
                    type="date"
                    name="date"
                    required
                    style={inputStyle}
                    onFocus={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(67, 233, 123, 0.5)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                />
            </div>

            <div>
                <label style={labelStyle}>Ödeme Tipi *</label>
                <select
                    name="type"
                    style={{
                        ...inputStyle,
                        cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(67, 233, 123, 0.5)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                >
                    <option value="CreditCard" style={{ background: '#1a1a2a' }}>Kredi Kartı</option>
                    <option value="Cash" style={{ background: '#1a1a2a' }}>Nakit</option>
                    <option value="Check" style={{ background: '#1a1a2a' }}>Çek</option>
                    <option value="Promissory" style={{ background: '#1a1a2a' }}>Senet</option>
                    <option value="Goods" style={{ background: '#1a1a2a' }}>Mal / Hizmet</option>
                </select>
            </div>

            <div>
                <label style={labelStyle}>Açıklama</label>
                <input
                    type="text"
                    name="description"
                    style={inputStyle}
                    onFocus={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(67, 233, 123, 0.5)';
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
