'use client';

import { toggleProjectStatus } from '@/app/actions/project';
import { Check } from 'lucide-react';
import { useTransition } from 'react';

interface ProjectStatusToggleProps {
    id: string | number;
    status: string;
}

export default function ProjectStatusToggle({ id, status }: ProjectStatusToggleProps) {
    const [isPending, startTransition] = useTransition();
    const isCompleted = status === 'Completed';

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent row click
        e.stopPropagation();

        startTransition(async () => {
            await toggleProjectStatus(id, status);
        });
    };

    return (
        <div
            onClick={handleToggle}
            style={{
                width: '1.25rem',
                height: '1.25rem', // Changed to square
                borderRadius: '0.25rem', // Changed to small radius for checkbox look
                border: isCompleted ? 'none' : '2px solid rgba(255, 255, 255, 0.2)',
                background: isCompleted ? '#10b981' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: isPending ? 0.7 : 1,
                flexShrink: 0
            }}
        >
            {isCompleted && <Check size={14} color="white" strokeWidth={3} />}
        </div>
    );
}
