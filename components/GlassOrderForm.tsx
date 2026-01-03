'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createGlassOrder } from '@/actions/glass';
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
                transition: 'all 0.3s ease',
            }}
        >
            <Save size={20} />
            {pending ? 'Kaydediliyor...' : 'Siparişi Kaydet'}
        </button>
    );
}

export default function GlassOrderForm({ projects }: { projects: any[] }) {
    const [state, formAction] = useActionState(createGlassOrder, null);

    // ✅ seçili proje
    const [projectId, setProjectId] = useState<string>('');
    const isOther = projectId === '__other__';

    // ✅ diğer seçilirse elle girilecek alan
    const [customProjectName, setCustomProjectName] = useState('');
    const [customClientName, setCustomClientName] = useState('');

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0.75rem',
        color: '#e8e8f0',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'all 0.2s',
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.813rem',
        fontWeight: 500,
        color: '#a0a0b8',
        marginBottom: '0.5rem',
    };

    return (
        <form
            action={formAction}
            style={{
                background: 'rgba(30, 30, 46, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '1.5rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
            }}
        >
            {state?.error && (
                <div
                    style={{
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '0.75rem',
                        color: '#f87171',
                        fontSize: '0.875rem',
                    }}
                >
                    {state.error}
                </div>
            )}

            {/* Order Information Section */}
            <div>
                <h3
                    style={{
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: '#e8e8f0',
                        marginBottom: '1.5rem',
                        paddingBottom: '0.75rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    Sipariş Bilgileri
                </h3>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Proje *</label>

                        <select
                            name="projectId"
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            // ✅ "Diğer" seçildiyse projectId zorunlu olmasın
                            required={!isOther}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                            onFocus={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(5, 150, 105, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            <option value="" style={{ background: '#1a1a2a' }}>
                                Proje Seçiniz
                            </option>

                            {/* ✅ en üstte "Diğer" */}
                            <option value="__other__" style={{ background: '#1a1a2a' }}>
                                Diğer (Elle gir)
                            </option>

                            {projects.map((p) => (
                                <option key={p.id} value={p.id} style={{ background: '#1a1a2a' }}>
                                    {p.description || `Project #${p.id}`} - {p.clientName || p.companyName}
                                </option>
                            ))}
                        </select>

                        {/* ✅ Diğer seçilince inputlar açılır */}
                        {isOther && (
                            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Proje Adı *</label>
                                    <input
                                        type="text"
                                        value={customProjectName}
                                        onChange={(e) => setCustomProjectName(e.target.value)}
                                        required={isOther}
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Müşteri (opsiyonel)</label>
                                    <input
                                        type="text"
                                        value={customClientName}
                                        onChange={(e) => setCustomClientName(e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ✅ server action'a gönderilecek alanlar */}
                        <input type="hidden" name="isOtherProject" value={isOther ? '1' : '0'} />
                        <input type="hidden" name="customProjectName" value={customProjectName} />
                        <input type="hidden" name="customClientName" value={customClientName} />
                    </div>

                    <div>
                        <label style={labelStyle}>Tedarikçi *</label>
                        <input type="text" name="supplier" required style={inputStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Sipariş Tarihi *</label>
                        <input type="date" name="orderDate" required defaultValue={new Date().toISOString().split('T')[0]} style={inputStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Tedarikçi Sipariş Kodu</label>
                        <input type="text" name="supplierOrderCode" placeholder="Tedarikçi sipariş numarası" style={inputStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Tedarikçi Teslim Tarihi</label>
                        <input type="date" name="supplierDeliveryDate" style={inputStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Durum</label>
                        <select name="status" style={{ ...inputStyle, cursor: 'pointer' }}>
                            <option value="Ordered" style={{ background: '#1a1a2a' }}>
                                Sipariş Verildi
                            </option>
                            <option value="InProgress" style={{ background: '#1a1a2a' }}>
                                Üretimde
                            </option>
                            <option value="Delivered" style={{ background: '#1a1a2a' }}>
                                Teslim Edildi
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                <SubmitButton />
            </div>
        </form>
    );
}
