'use server';

import { admin } from '@/utils/firebaseAdmin';
import { revalidatePath } from 'next/cache';

const firestore = admin.firestore();

export async function deleteProductionJob(id: string | number) {
    try {
        const docId = String(id);
        await firestore.collection('productionJobs').doc(docId).delete();

        revalidatePath('/dashboard/production');
    } catch (error) {
        console.error('deleteProductionJob error', error);
    }
}
