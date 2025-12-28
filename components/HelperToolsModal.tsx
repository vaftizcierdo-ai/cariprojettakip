'use client';

import { X, Scissors, Calculator, Ruler, FileText, Package, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HelperToolsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HelperToolsModal({ isOpen, onClose }: HelperToolsModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const tools = [
        {
            id: 'fabric-drawing',
            name: 'Kumaş Çizimi',
            icon: Scissors,
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            href: '/tools/fabric-drawing'
        },
        {
            id: 'calculator',
            name: 'Hesap Makinesi',
            icon: Calculator,
            gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
            href: '/tools/calculator'
        },
        {
            id: 'measurement',
            name: 'Ölçü Hesaplama',
            icon: Ruler,
            gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            href: '/tools/measurement'
        },
        {
            id: 'notes',
            name: 'Hızlı Notlar',
            icon: FileText,
            gradient: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
            href: '/tools/notes'
        },
        {
            id: 'inventory',
            name: 'Stok Takip',
            icon: Package,
            gradient: 'linear-gradient(135deg, #10b981 0%, #065f46 100%)',
            href: '/tools/inventory'
        },
        {
            id: 'color-picker',
            name: 'Renk Seçici',
            icon: Palette,
            gradient: 'linear-gradient(135deg, #34d399 0%, #064e3b 100%)',
            href: '/tools/color-picker'
        },
    ];

    const handleToolClick = (href: string) => {
        router.push(href);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}
            >
                {/* Modal */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'rgba(30, 30, 46, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '1.5rem',
                        padding: '2rem',
                        maxWidth: '600px',
                        width: '100%',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        position: 'relative'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            background: 'linear-gradient(to right, #34d399, #10b981)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            Yardımcı Araçlar
                        </h2>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.5rem',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                color: '#9ca3af',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.color = '#9ca3af';
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Tools Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem'
                    }}>
                        {tools.map((tool) => {
                            const Icon = tool.icon;
                            return (
                                <div
                                    key={tool.id}
                                    onClick={() => handleToolClick(tool.href)}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '1rem',
                                        padding: '1.5rem 1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = tool.gradient;
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '0.75rem',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Icon size={24} color="#10b981" />
                                    </div>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: '#e8e8f0',
                                        textAlign: 'center'
                                    }}>
                                        {tool.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
