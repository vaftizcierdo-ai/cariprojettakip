import { prisma } from '@/lib/db';

export async function getGlassOrders() {
    return await prisma.glassOrder.findMany({
        include: {
            project: { select: { id: true, description: true, clientName: true, companyName: true } }
        },
        orderBy: { orderDate: 'desc' },
    });
}
