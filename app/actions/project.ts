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

async function deleteCollectionDocs(ref: FirebaseFirestore.Query | FirebaseFirestore.CollectionReference) {
    const snap = await ref.get();
    if (snap.empty) return;

    let batch = firestore.batch();
    let count = 0;

    for (const d of snap.docs) {
        batch.delete(d.ref);
        count++;

        if (count >= 450) {
            await batch.commit();
            batch = firestore.batch();
            count = 0;
        }
    }

    if (count > 0) await batch.commit();
}

async function deleteByProjectId(collectionName: string, projectIdStr: string) {
    // string match
    await deleteCollectionDocs(
        firestore.collection(collectionName).where('projectId', '==', projectIdStr)
    );

    // number match (sadece numeric ise)
    const asNumber = Number(projectIdStr);
    if (!Number.isNaN(asNumber)) {
        await deleteCollectionDocs(
            firestore.collection(collectionName).where('projectId', '==', asNumber)
        );
    }
}

export async function deleteProject(id: string | number) {
    const projectId = String(id);

    try {
        const projectRef = firestore.collection('projects').doc(projectId);

        // ✅ Root collection'larda projectId ile bağlı olan her şeyi sil
        await Promise.all([
            deleteByProjectId('glassOrders', projectId),
            deleteByProjectId('productionJobs', projectId),
            deleteByProjectId('serviceRequests', projectId),
        ]);

        // ✅ Proje altı subcollection'lar (varsa) sil
        const subcollections = ['payments', 'logs', 'expenses', 'services', 'production', 'glassOrders'] as const;
        for (const sub of subcollections) {
            await deleteCollectionDocs(projectRef.collection(sub));
        }

        // ✅ Projeyi sil
        await projectRef.delete();

        // ✅ Revalidate
        revalidatePath('/dashboard/projects');
        revalidatePath('/dashboard/glass-orders');
        revalidatePath('/dashboard/production');
        revalidatePath('/dashboard/services');
        revalidatePath('/dashboard/calendar');
        revalidatePath('/');
    } catch (error) {
        console.error('deleteProject error', error);
    }

    redirect('/dashboard/projects');
}
