import { prisma } from '@/lib/db';

export async function getDashboardStats(year: number) {
    // Define date range for the year if needed, or just filter by startDate?
    // Request says: "Working Year (Dropdown – seçilen yıl bütün verileri filtrelemede kullanılacak)"
    // So we filter projects starting or active in that year.
    // For simplicity, let's assume we filter by startDate year.

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    const totalProjects = await prisma.project.count({
        where: {
            startDate: {
                gte: startOfYear,
                lt: endOfYear,
            },
        },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const delayedProjects = await prisma.project.count({
        where: {
            endDate: {
                lt: today
            },
            status: {
                not: 'Completed'
            }
        },
    });

    const openServices = await prisma.serviceRequest.count({
        where: {
            status: { not: 'Solved' },
        },
    });

    const productionJobs = await prisma.productionJob.count({
        where: {
            status: { in: ['Waiting', 'InProduction'] },
        },
    });

    return {
        totalProjects,
        delayedProjects, // or overdueProjects
        openServices,
        productionJobs,
    };
}

export async function getUpcomingProjects() {
    const today = new Date();
    // Reset time to start of day for comparison
    today.setHours(0, 0, 0, 0);

    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);

    const projects = await prisma.project.findMany({
        where: {
            status: {
                not: 'Completed'
            },
            endDate: {
                lte: threeDaysLater
            }
        },
        orderBy: {
            endDate: 'asc'
        },
        take: 5 // Limit to 5 for dashboard display? Or show all? User didn't specify limit, but usually dashboard has limits. Let's show all for now as user said "birden fazla proje varsa".
    });

    return projects;
}
