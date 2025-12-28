'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createServiceRequest } from '@/actions/service';
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
                background: pending ? 'rgba(4, 120, 87, 0.5)' : 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.875rem',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: pending ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(4, 120, 87, 0.4)',
                transition: 'all 0.3s ease'
            }}
        >
            <Save size={20} />
            {pending ? 'Kaydediliyor...' : 'Talebi Kaydet'}
        </button>
    );
}

export default function ServiceForm({ projects }: { projects: any[] }) {
    const [state, formAction] = useActionState(createServiceRequest, null);

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
            gap: '2rem'
        }}>
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
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#e8e8f0',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    Servis Talebi Detayları
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem'
                }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>İlgili Proje *</label>
                        <select
                            name="projectId"
                            required
                            style={{
                                ...inputStyle,
                                cursor: 'pointer'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(4, 120, 87, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            <option value="" style={{ background: '#1a1a2a' }}>Proje Seçiniz</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id} style={{ background: '#1a1a2a' }}>
                                    {p.description || `Project #${p.id}`} - {p.clientName || p.companyName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Şikayet Tarihi *</label>
                        <input
                            type="date"
                            name="complaintDate"
                            required
                            defaultValue={new Date().toISOString().split('T')[0]}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(250, 112, 154, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Durum</label>
                        <select
                            name="status"
                            style={{
                                ...inputStyle,
                                cursor: 'pointer'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(250, 112, 154, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            <option value="Open" style={{ background: '#1a1a2a' }}>Açık</option>
                            <option value="InProgress" style={{ background: '#1a1a2a' }}>İşlemde</option>
                            <option value="Solved" style={{ background: '#1a1a2a' }}>Çözüldü</option>
                        </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Açıklama *</label>
                        <textarea
                            name="description"
                            rows={4}
                            required
                            placeholder="Şikayet veya talep detaylarını giriniz..."
                            style={{
                                ...inputStyle,
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(250, 112, 154, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                <SubmitButton />
            </div>
        </form>
    );
}
