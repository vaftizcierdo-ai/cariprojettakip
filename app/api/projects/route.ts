import { NextResponse } from 'next/server';
import { getProjects } from '@/services/projectService';

export async function GET() {
    try {
        const projects = await getProjects({});

        return NextResponse.json(projects.map(p => ({
            id: p.id,
            description: p.description,
            status: p.status,
            startDate: p.startDate,
            endDate: p.endDate
        })));
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}
