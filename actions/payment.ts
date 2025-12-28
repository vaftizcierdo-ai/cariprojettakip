'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { admin } from '@/utils/firebaseAdmin';

const firestore = admin.firestore();

export async function addPayment(prevState: any, formData: FormData) {
    const projectId = String(formData.get('projectId') as string);
    const amount = parseFloat(formData.get('amount') as string);
    const date = formData.get('date') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;

    if (!amount || !date || !type) {
        return { error: 'Lütfen zorunlu alanları doldurun.' };
    }

    try {
        await firestore.collection('projects').doc(projectId).collection('payments').add({
            amount,
            date: admin.firestore.Timestamp.fromDate(new Date(date)),
            type,
            description: description || null,
            createdAt: admin.firestore.Timestamp.now(),
        });

        revalidatePath(`/dashboard/projects/${projectId}`);
    } catch (error) {
        console.error('addPayment error', error);
        return { error: 'Ödeme eklenirken hata oluştu.' };
    }

    redirect(`/dashboard/projects/${projectId}`);
}
