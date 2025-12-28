'use server';

import { admin } from '@/utils/firebaseAdmin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const firestore = admin.firestore();

export async function createServiceRequest(prevState: any, formData: FormData) {
    const projectIdStr = (formData.get('projectId') as string)?.trim();
    const complaintDate = formData.get('complaintDate') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as string;

    if (!projectIdStr || !complaintDate || !description) {
        return { error: 'Lütfen zorunlu alanları doldurun.' };
    }

    try {
        await firestore.collection('serviceRequests').add({
            projectId: projectIdStr,
            complaintDate: admin.firestore.Timestamp.fromDate(new Date(complaintDate)),
            description: description,
            status: status || 'Open',
            resolutionDate: null,
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now(),
        });

        revalidatePath('/dashboard/services');
    } catch (error) {
        console.error('createServiceRequest error', error);
        return { error: 'Servis talebi oluşturulurken hata oluştu.' };
    }

    redirect('/dashboard/services');
}

export async function updateServiceRequest(id: string | number, prevState: any, formData: FormData) {
    const status = formData.get('status') as string;
    const resolutionNote = formData.get('resolutionNote') as string;

    try {
        const docId = String(id);
        const data: any = { status, updatedAt: admin.firestore.Timestamp.now() };
        
        if (resolutionNote) {
            data.resolutionNote = resolutionNote;
            data.resolutionDate = admin.firestore.Timestamp.now();
        }

        if (status === 'Solved' && !data.resolutionDate) {
            data.resolutionDate = admin.firestore.Timestamp.now();
        }

        await firestore.collection('serviceRequests').doc(docId).update(data);

        revalidatePath('/dashboard/services');
        revalidatePath(`/dashboard/services/${id}`);
    } catch (error) {
        console.error('updateServiceRequest error', error);
        return { error: 'Güncellenirken hata oluştu.' };
    }

    redirect('/dashboard/services');
}

export async function deleteServiceRequest(id: string | number) {
    try {
        const docId = String(id);
        await firestore.collection('serviceRequests').doc(docId).delete();

        revalidatePath('/dashboard/services');
    } catch (error) {
        console.error('deleteServiceRequest error', error);
        return { error: 'Servis talebi silinirken hata oluştu.' };
    }

    redirect('/dashboard/services');
}
