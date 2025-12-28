'use server';

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createProductionJob(prevState: any, formData: FormData) {
    const projectId = parseInt(formData.get('projectId') as string);
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const orderDate = formData.get('orderDate') as string;
    const estimatedEndDate = formData.get('estimatedEndDate') as string;
    const status = formData.get('status') as string;

    if (!projectId || !type || !orderDate) {
        return { error: 'Lütfen zorunlu alanları doldurun.' };
    }

    try {
        await prisma.productionJob.create({
            data: {
                projectId,
                type,
                description,
                orderDate: new Date(orderDate),
                estimatedEndDate: estimatedEndDate ? new Date(estimatedEndDate) : null,
                status: status || 'Waiting',
            },
        });

        revalidatePath('/production');
    } catch (error) {
        return { error: 'İmalat kaydı oluşturulurken hata oluştu.' };
    }

    redirect('/production');
}

export async function deleteProductionJob(id: number) {
    await prisma.productionJob.delete({
        where: { id }
    });

    revalidatePath('/production');
}
