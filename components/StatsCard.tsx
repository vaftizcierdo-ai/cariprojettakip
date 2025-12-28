'use client';

import { Briefcase, AlertCircle, Wrench, Factory, CalendarDays, GlassWater } from 'lucide-react';
import { useState } from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    iconName: string;
    trend?: string;
    trendUp?: boolean;
    color?: 'purple' | 'pink' | 'cyan' | 'emerald' | 'orange';
}

const iconMap = {
    Briefcase,
    AlertCircle,
    Wrench,
    Factory,
    CalendarDays,
    GlassWater
};

export default function StatsCard({ title, value, iconName, trend, trendUp, color = 'purple' }: StatsCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const Icon = iconMap[iconName as keyof typeof iconMap] || Briefcase;

    const gradients = {
        purple: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        pink: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
        cyan: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        emerald: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
        orange: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
    };

    return (
        <div
            className="cursor-default relative overflow-hidden"
            style={{
                background: '#1e1e2e',
                border: `1px solid ${isHovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '1rem', // Reduced from 1.5rem
                padding: '1rem', // Reduced from 1.5rem
                boxShadow: isHovered ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.3s ease',
                minHeight: '120px', // Reduced from 160px
                display: 'flex',
                flexDirection: 'column' as const,
                justifyContent: 'space-between',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position: 'absolute',
                    top: '-60px', // Adjusted
                    right: '-60px', // Adjusted
                    width: '120px', // Reduced
                    height: '120px', // Reduced
                    background: gradients[color],
                    borderRadius: '50%',
                    opacity: 0.15,
                    filter: 'blur(50px)',
                    pointerEvents: 'none'
                }}
            ></div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                <div>
                    <h3 style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.25rem', color: '#a0a0b8' }}>{title}</h3>
                    <div
                        style={{
                            fontSize: '1.75rem', // Reduced from 2.25rem
                            fontWeight: 700,
                            marginBottom: '0.125rem',
                            background: gradients[color],
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        {value}
                    </div>

                    {trend && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', fontWeight: 500, marginTop: '0.25rem' }}>
                            <span style={{ color: trendUp ? '#34d399' : '#f87171' }}>
                                {trendUp ? '↑' : '↓'} {trend}
                            </span>
                            <span style={{ color: '#6b6b80' }}></span>
                        </div>
                    )}
                </div>

                <div
                    style={{
                        background: gradients[color],
                        padding: '0.75rem', // Reduced from 1rem
                        borderRadius: '0.75rem',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                        transition: 'transform 0.3s ease'
                    }}
                >
                    <Icon size={20} color="white" /> {/* Reduced from 28 */}
                </div>
            </div>
        </div>
    );
}
