import { prisma } from '@/lib/db';

export async function globalSearch(query: string) {
    if (!query) return { projects: [], services: [], production: [], glass: [] };

    const [projects, services, production, glass] = await prisma.$transaction([
        prisma.project.findMany({
            where: {
                OR: [
                    { description: { contains: query } },
                    { clientName: { contains: query } },
                    { companyName: { contains: query } },
                    { city: { contains: query } },
                ]
            },
            take: 5
        }),
        prisma.serviceRequest.findMany({
            where: {
                OR: [
                    { description: { contains: query } },
                    { project: { description: { contains: query } } },
                    { project: { clientName: { contains: query } } },
                ]
            },
            include: { project: true },
            take: 5
        }),
        prisma.productionJob.findMany({
            where: {
                OR: [
                    { description: { contains: query } },
                    { type: { contains: query } },
                    { project: { description: { contains: query } } },
                ]
            },
            include: { project: true },
            take: 5
        }),
        prisma.glassOrder.findMany({
            where: {
                OR: [
                    { supplier: { contains: query } },
                    { project: { description: { contains: query } } },
                ]
            },
            include: { project: true },
            take: 5
        })
    ]);

    return { projects, services, production, glass };
}