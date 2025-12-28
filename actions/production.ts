'use server';

import { admin } from '@/utils/firebaseAdmin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const firestore = admin.firestore();

export async function createProductionJob(prevState: any, formData: FormData) {
    const projectIdStr = (formData.get('projectId') as string)?.trim();
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const orderDate = formData.get('orderDate') as string;
    const estimatedEndDate = formData.get('estimatedEndDate') as string;
    const status = formData.get('status') as string;

    if (!projectIdStr || !type || !orderDate) {
        return { error: 'Lütfen zorunlu alanları doldurun.' };
    }

    try {
        await firestore.collection('productionJobs').add({
            projectId: projectIdStr,
            type,
            description: description || null,
            orderDate: admin.firestore.Timestamp.fromDate(new Date(orderDate)),
            estimatedEndDate: estimatedEndDate ? admin.firestore.Timestamp.fromDate(new Date(estimatedEndDate)) : null,
            status: status || 'Waiting',
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now(),
        });

        revalidatePath('/dashboard/production');
    } catch (error) {
        console.error('createProductionJob error', error);
        return { error: 'İmalat kaydı oluşturulurken hata oluştu.' };
    }

    redirect('/dashboard/production');
}

export async function deleteProductionJob(id: string | number) {
    try {
        const docId = String(id);
        await firestore.collection('productionJobs').doc(docId).delete();

        revalidatePath('/dashboard/production');
    } catch (error) {
        console.error('deleteProductionJob error', error);
        return { error: 'Kayıt silinirken hata oluştu.' };
    }

    redirect('/dashboard/production');
}
