'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createProject } from '@/actions/project';
import { Save } from 'lucide-react';

function SubmitButton({ isEdit }: { isEdit?: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: pending ? 'rgba(16, 185, 129, 0.5)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.875rem',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: pending ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s ease'
            }}
        >
            <Save size={20} />
            {pending ? (isEdit ? 'Güncelleniyor...' : 'Kaydediliyor...') : (isEdit ? 'Projeyi Güncelle' : 'Projeyi Kaydet')}
        </button>
    );
}

// ... component imports

interface ProjectFormProps {
    project?: any; // Using any for simplicity as per existing patterns, but preferably Project type
    action?: (prevState: any, formData: FormData) => Promise<any>;
}

export default function ProjectForm({ project, action }: ProjectFormProps) {
    const [state, formAction] = useActionState(action || createProject, null);
    const [clientType, setClientType] = useState(project?.clientType || 'Individual');

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

            {/* Client Information */}
            <div>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#e8e8f0',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    Müşteri Bilgileri
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem'
                }}>
                    <div>
                        <label style={labelStyle}>Müşteri Tipi</label>
                        <select
                            name="clientType"
                            value={clientType}
                            onChange={(e) => setClientType(e.target.value)}
                            style={{
                                ...inputStyle,
                                cursor: 'pointer'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            <option value="Individual" style={{ background: '#1a1a2a' }}>Bireysel</option>
                            <option value="Company" style={{ background: '#1a1a2a' }}>Kurumsal</option>
                        </select>
                    </div>

                    {clientType === 'Individual' ? (
                        <div>
                            <label style={labelStyle}>Ad Soyad</label>
                            <input
                                type="text"
                                name="clientName"
                                defaultValue={project?.clientName || ''}
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                    e.currentTarget.style.borderColor = 'rgba(240, 147, 251, 0.5)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                }}
                            />
                        </div>
                    ) : (
                        <div>
                            <label style={labelStyle}>Şirket Adı</label>
                            <input
                                type="text"
                                name="companyName"
                                defaultValue={project?.companyName || ''}
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                    e.currentTarget.style.borderColor = 'rgba(240, 147, 251, 0.5)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                }}
                            />
                        </div>
                    )}

                    <div>
                        <label style={labelStyle}>Telefon</label>
                        <input
                            type="tel"
                            name="phone"
                            defaultValue={project?.phone || ''}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(240, 147, 251, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>E-posta</label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={project?.email || ''}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(240, 147, 251, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Ülke</label>
                        <input
                            type="text"
                            name="country"
                            defaultValue={project?.country || 'Türkiye'}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(240, 147, 251, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Şehir</label>
                        <input
                            type="text"
                            name="city"
                            defaultValue={project?.city || ''}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(240, 147, 251, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>İlçe</label>
                        <input
                            type="text"
                            name="district"
                            defaultValue={project?.district || ''}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(240, 147, 251, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Project Details */}
            <div>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#e8e8f0',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    Proje Detayları
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem'
                }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Proje Adı / Açıklama *</label>
                        <input
                            type="text"
                            name="description"
                            required
                            defaultValue={project?.description || ''}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(240, 147, 251, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Anlaşılan Fiyat (TL)</label>
                        <input
                            type="number"
                            name="agreedPrice"
                            step="0.01"
                            defaultValue={project?.agreedPrice || ''}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(240, 147, 251, 0.5)';
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
                            defaultValue={project?.status || 'Open'}
                            style={{
                                ...inputStyle,
                                cursor: 'pointer'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(240, 147, 251, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            <option value="Open" style={{ background: '#1a1a2a' }}>Açık</option>
                            <option value="InProgress" style={{ background: '#1a1a2a' }}>Devam Ediyor</option>
                            <option value="Completed" style={{ background: '#1a1a2a' }}>Tamamlandı</option>
                            <option value="Delayed" style={{ background: '#1a1a2a' }}>Gecikmiş</option>
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Başlangıç Tarihi *</label>
                        <input
                            type="date"
                            name="startDate"
                            required
                            defaultValue={project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : ''}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(240, 147, 251, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Bitiş Tarihi *</label>
                        <input
                            type="date"
                            name="endDate"
                            required
                            defaultValue={project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(240, 147, 251, 0.5)';
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
                <SubmitButton isEdit={!!project} />
            </div>
        </form>
    );
}
