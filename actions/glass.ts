'use server';

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createGlassOrder(prevState: any, formData: FormData) {
    const projectId = parseInt(formData.get('projectId') as string);
    const supplier = formData.get('supplier') as string;
    const orderDate = formData.get('orderDate') as string;
    const status = formData.get('status') as string;
    const supplierOrderCode = formData.get('supplierOrderCode') as string;
    const supplierDeliveryDate = formData.get('supplierDeliveryDate') as string;

    if (!projectId || !supplier || !orderDate) {
        return { error: 'Lütfen zorunlu alanları doldurun.' };
    }

    try {
        await prisma.glassOrder.create({
            data: {
                projectId,
                supplier,
                orderDate: new Date(orderDate),
                status: status || 'Ordered',
                supplierOrderCode: supplierOrderCode || null,
                supplierDeliveryDate: supplierDeliveryDate ? new Date(supplierDeliveryDate) : null,
            },
        });

        revalidatePath('/glass-orders');
    } catch (error) {
        console.error(error);
        return { error: 'Cam siparişi oluşturulurken hata oluştu.' };
    }

    redirect('/glass-orders');
}

export async function toggleGlassOrderCompletion(id: number, currentCompleted: boolean) {
    await prisma.glassOrder.update({
        where: { id },
        data: { completed: !currentCompleted }
    });

    revalidatePath('/glass-orders');
}
