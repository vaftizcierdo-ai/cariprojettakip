'use client';

import { toggleGlassOrderCompletion } from '@/actions/glass';
import { Check } from 'lucide-react';
import { useTransition } from 'react';

interface GlassOrderToggleProps {
    id: number;
    completed: boolean;
}

export default function GlassOrderToggle({ id, completed }: GlassOrderToggleProps) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        startTransition(async () => {
            await toggleGlassOrderCompletion(id, completed);
        });
    };

    return (
        <div
            onClick={handleToggle}
            style={{
                width: '1.25rem',
                height: '1.25rem',
                borderRadius: '0.25rem',
                border: completed ? 'none' : '2px solid rgba(255, 255, 255, 0.2)',
                background: completed ? '#10b981' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: isPending ? 0.7 : 1,
                flexShrink: 0
            }}
        >
            {completed && <Check size={14} color="white" strokeWidth={3} />}
        </div>
    );
}
