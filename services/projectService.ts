import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function getProjects(options: { year?: number; status?: string; search?: string } = {}) {
    const { year, status, search } = options;

    const where: Prisma.ProjectWhereInput = {};

    if (year) {
        where.startDate = {
            gte: new Date(year, 0, 1),
            lt: new Date(year + 1, 0, 1),
        };
    }

    if (status) {
        where.status = status;
    }

    if (search) {
        where.OR = [
            { clientName: { contains: search } },
            { companyName: { contains: search } },
            { city: { contains: search } },
            { description: { contains: search } },
        ];
    }

    const projects = await prisma.project.findMany({
        where,
        orderBy: [
            { startDate: 'desc' }
        ],
    });

    // Sort to put Completed projects at the bottom
    return projects.sort((a, b) => {
        if (a.status === 'Completed' && b.status !== 'Completed') return 1;
        if (a.status !== 'Completed' && b.status === 'Completed') return -1;
        return 0;
    });
}

export async function getProjectById(id: number) {
    return await prisma.project.findUnique({
        where: { id },
        include: {
            payments: true,
            services: true,
            production: true,
            glassOrders: true,
            logs: true,
            expenses: true,
        }
    });
}
