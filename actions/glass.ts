'use server';

import { admin } from '@/utils/firebaseAdmin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const firestore = admin.firestore();

export async function createGlassOrder(prevState: any, formData: FormData) {
    const projectIdStr = (formData.get('projectId') as string)?.trim();
    const supplier = formData.get('supplier') as string;
    const orderDate = formData.get('orderDate') as string;
    const status = formData.get('status') as string;
    const supplierOrderCode = formData.get('supplierOrderCode') as string;
    const supplierDeliveryDate = formData.get('supplierDeliveryDate') as string;

    if (!projectIdStr || !supplier || !orderDate) {
        return { error: 'Lütfen zorunlu alanları doldurun.' };
    }

    try {
        await firestore.collection('glassOrders').add({
            projectId: projectIdStr,
            supplier,
            orderDate: admin.firestore.Timestamp.fromDate(new Date(orderDate)),
            status: status || 'Ordered',
            supplierOrderCode: supplierOrderCode || null,
            supplierDeliveryDate: supplierDeliveryDate ? admin.firestore.Timestamp.fromDate(new Date(supplierDeliveryDate)) : null,
            completed: false,
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now(),
        });

        revalidatePath('/dashboard/glass-orders');
    } catch (error) {
        console.error('createGlassOrder error', error);
        return { error: 'Cam siparişi oluşturulurken hata oluştu.' };
    }

    redirect('/dashboard/glass-orders');
}

export async function toggleGlassOrderCompletion(id: string | number, currentCompleted: boolean) {
    try {
        const docId = String(id);
        await firestore.collection('glassOrders').doc(docId).update({
            completed: !currentCompleted,
            updatedAt: admin.firestore.Timestamp.now()
        });

        revalidatePath('/dashboard/glass-orders');
    } catch (error) {
        console.error('toggleGlassOrderCompletion error', error);
    }
}
