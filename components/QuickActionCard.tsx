'use client';

import Link from 'next/link';
import { Briefcase, CalendarDays, Factory, Wrench, GlassWater } from 'lucide-react';
import { useState } from 'react';

interface QuickActionCardProps {
    href: string;
    label: string;
    iconName: string;
    gradient: string;
}

const iconMap = {
    Briefcase,
    CalendarDays,
    Factory,
    Wrench,
    GlassWater
};

export default function QuickActionCard({ href, label, iconName, gradient }: QuickActionCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const Icon = iconMap[iconName as keyof typeof iconMap] || Briefcase;

    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <div
                style={{
                    background: 'rgba(30, 30, 46, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${isHovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '1.5rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column' as const,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    height: '160px',
                    position: 'relative' as const,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div style={{
                    background: gradient,
                    padding: '0.75rem',
                    borderRadius: '0.75rem'
                }}>
                    <Icon size={24} color="white" />
                </div>
                <span style={{ fontWeight: 600, color: '#e8e8f0', position: 'relative', zIndex: 10 }}>{label}</span>
            </div>
        </Link>
    );
}
