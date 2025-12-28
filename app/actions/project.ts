'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { admin } from '@/utils/firebaseAdmin';

const firestore = admin.firestore();

export async function toggleProjectStatus(id: string | number, currentStatus: string) {
    const newStatus = currentStatus === 'Completed' ? 'Open' : 'Completed';

    try {
        await firestore.collection('projects').doc(String(id)).update({
            status: newStatus
        });

        revalidatePath('/dashboard/projects');
        revalidatePath(`/dashboard/projects/${id}`);
    } catch (error) {
        console.error('toggleProjectStatus error', error);
    }
}

export async function deleteProject(id: string | number) {
    try {
        const projectRef = firestore.collection('projects').doc(String(id));
        
        // Delete all subcollections first
        const subcollections = ['payments', 'logs', 'expenses', 'services', 'production', 'glassOrders'];
        
        for (const subcoll of subcollections) {
            const subcollRef = projectRef.collection(subcoll);
            const docs = await subcollRef.get();
            
            for (const doc of docs.docs) {
                await doc.ref.delete();
            }
        }
        
        // Then delete the project document itself
        await projectRef.delete();

        revalidatePath('/dashboard/projects');
    } catch (error) {
        console.error('deleteProject error', error);
    }

    redirect('/dashboard/projects');
}
