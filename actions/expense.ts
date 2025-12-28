'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { admin } from '@/utils/firebaseAdmin';

const firestore = admin.firestore();

export async function addExpense(prevState: any, formData: FormData) {
    const projectId = String(formData.get('projectId') as string);
    const amount = parseFloat(formData.get('amount') as string);
    const date = formData.get('date') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    if (!amount || !date || !category) {
        return { error: 'Lütfen zorunlu alanları doldurun.' };
    }

    try {
        const docRef = firestore.collection('projects').doc(projectId).collection('expenses').doc();
        await docRef.set({
            amount,
            date: admin.firestore.Timestamp.fromDate(new Date(date)),
            category,
            description: description || null,
            createdAt: admin.firestore.Timestamp.now(),
        });

        revalidatePath(`/dashboard/projects/${projectId}`);
        revalidatePath('/dashboard/financial-status');
    } catch (error) {
        console.error('addExpense error', error);
        return { error: 'Gider eklenirken hata oluştu.' };
    }

    redirect(`/dashboard/projects/${projectId}`);
}
