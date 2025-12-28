'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteProductionJob(id: number) {
    await prisma.productionJob.delete({
        where: { id }
    });

    revalidatePath('/production');
}
