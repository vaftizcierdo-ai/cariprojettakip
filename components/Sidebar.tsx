'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    CalendarDays,
    Briefcase,
    Wrench,
    Factory,
    GlassWater,
    RectangleCircle,
    TrendingUp,
    LogOut,
    Hammer
} from 'lucide-react';
import { logout } from '@/actions/auth';
import HelperToolsModal from './HelperToolsModal';

const Sidebar = () => {
    const pathname = usePathname();
    const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);

    const links = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard, gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { href: '/dashboard/projects', label: 'Projects', icon: Briefcase, gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' },
        { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarDays, gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
        { href: '/dashboard/services', label: 'Services', icon: Wrench, gradient: 'linear-gradient(135deg, #047857 0%, #065f46 100%)' },
        { href: '/dashboard/production', label: 'Production', icon: Factory, gradient: 'linear-gradient(135deg, #10b981 0%, #065f46 100%)' },
        { href: '/dashboard/glass-orders', label: 'Glass Orders', icon: RectangleCircle, gradient: 'linear-gradient(135deg, #34d399 0%, #064e3b 100%)' },
        { href: '/dashboard/financial-status', label: 'Mali Durum', icon: TrendingUp, gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    ];

    return (
        <aside style={{
            width: '220px',
            height: '100vh',
            background: 'linear-gradient(180deg, #111827 0%, #1f2937 100%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '1rem',
            gap: '0.5rem'
        }}>
            {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        style={{ textDecoration: 'none', width: '85%' }}
                    >
                        <div
                            style={{
                                background: isActive ? link.gradient : 'rgba(255, 255, 255, 0.03)',
                                border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '0.75rem',
                                padding: '0.75rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.4rem',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            <Icon
                                size={20}
                                color={isActive ? 'white' : '#9ca3af'}
                            />
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: isActive ? 600 : 500,
                                color: isActive ? 'white' : '#9ca3af',
                                textAlign: 'center'
                            }}>
                                {link.label}
                            </span>
                        </div>
                    </Link>
                );
            })}

            {/* Helper Tools Button */}
            <div style={{ width: '85%', marginTop: '0.5rem' }}>
                <div
                    onClick={() => setIsToolsModalOpen(true)}
                    style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '0.75rem',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <Hammer
                        size={20}
                        color='#9ca3af'
                    />
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#9ca3af',
                        textAlign: 'center'
                    }}>
                        Yardımcı Araçlar
                    </span>
                </div>
            </div>

            {/* User Profile at bottom */}
            <div style={{
                marginTop: 'auto',
                marginBottom: '0.75rem',
                padding: '0.75rem',
                width: '85%',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'white'
                }}>
                    ER
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'white', marginBottom: '0.125rem' }}>Erdogan</p>
                    <p style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Yönetici</p>
                </div>
                <button
                    onClick={() => logout()}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                    title="Çıkış Yap"
                >
                    <LogOut size={20} />
                </button>
            </div>

            {/* Helper Tools Modal */}
            <HelperToolsModal
                isOpen={isToolsModalOpen}
                onClose={() => setIsToolsModalOpen(false)}
            />
        </aside>
    );
};

export default Sidebar;
