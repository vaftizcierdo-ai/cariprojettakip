'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { admin } from '@/utils/firebaseAdmin';

const firestore = admin.firestore();

export async function addLog(prevState: any, formData: FormData) {
    const projectId = String(formData.get('projectId') as string);
    const content = formData.get('content') as string;

    if (!content) {
        return { error: 'Lütfen içerik girin.' };
    }

    try {
        await firestore.collection('projects').doc(projectId).collection('logs').add({
            content,
            createdAt: admin.firestore.Timestamp.now(),
        });

        // Update project updatedAt timestamp
        await firestore.collection('projects').doc(projectId).update({
            updatedAt: admin.firestore.Timestamp.now()
        });

        revalidatePath(`/dashboard/projects/${projectId}`);
    } catch (error) {
        console.error('addLog error', error);
        return { error: 'Log eklenirken hata oluştu.' };
    }

    redirect(`/dashboard/projects/${projectId}`);
}
