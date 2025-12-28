import GlassOrderForm from '@/components/GlassOrderForm';
import { getProjects } from '@/services/projectService';

export default async function NewGlassOrderPage() {
    const projects = await getProjects();

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    New Glass Order
                </h1>
                <p style={{ color: '#a0a0b8', fontSize: '0.875rem' }}>Create detailed glass order for projects</p>
            </div>

            <GlassOrderForm projects={projects} />
        </div>
    );
}
