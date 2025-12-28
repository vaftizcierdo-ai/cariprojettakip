import { prisma } from '@/lib/db';

export async function getProductionJobs(type?: string) {
    const jobs = await prisma.productionJob.findMany({
        where: type ? { type } : undefined,
        include: {
            project: {
                select: {
                    id: true,
                    description: true,
                    clientName: true,
                    companyName: true,
                    city: true,
                    district: true
                }
            }
        },
        orderBy: { orderDate: 'desc' },
    });

    return jobs;
}
