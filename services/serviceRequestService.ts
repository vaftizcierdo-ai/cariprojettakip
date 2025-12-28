import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function getServiceRequests(status?: string, search?: string) {
    const where: Prisma.ServiceRequestWhereInput = {};

    if (status) {
        where.status = status;
    }

    if (search) {
        where.OR = [
            { description: { contains: search } },
            { project: { description: { contains: search } } },
            { project: { clientName: { contains: search } } },
        ];
    }

    return await prisma.serviceRequest.findMany({
        where,
        include: {
            project: { select: { id: true, description: true, clientName: true, companyName: true } }
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getServiceRequestById(id: number) {
    return await prisma.serviceRequest.findUnique({
        where: { id },
        include: {
            project: true,
        }
    });
}
