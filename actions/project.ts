'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { admin } from '@/utils/firebaseAdmin';

const firestore = admin.firestore();

export async function createProject(prevState: any, formData: FormData) {
    const clientType = formData.get('clientType') as string;
    const clientName = formData.get('clientName') as string;
    const companyName = formData.get('companyName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const country = formData.get('country') as string;
    const city = formData.get('city') as string;
    const district = formData.get('district') as string;

    const description = formData.get('description') as string;
    const agreedPrice = parseFloat(formData.get('agreedPrice') as string);
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const status = formData.get('status') as string;

    if (!description || !startDate || !endDate) {
        return { error: 'Lütfen zorunlu alanları doldurun.' };
    }

    try {
        await firestore.collection('projects').add({
            clientType,
            clientName: clientName || null,
            companyName: companyName || null,
            phone: phone || null,
            email: email || null,
            country: country || null,
            city: city || null,
            district: district || null,
            description,
            agreedPrice: isNaN(agreedPrice) ? 0 : agreedPrice,
            startDate: admin.firestore.Timestamp.fromDate(new Date(startDate)),
            endDate: admin.firestore.Timestamp.fromDate(new Date(endDate)),
            status: status || 'Open',
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now(),
        });

        revalidatePath('/dashboard/projects');
        revalidatePath('/dashboard/calendar');
        revalidatePath('/'); // dashboard
    } catch (error) {
        console.error('createProject error', error);
        return { error: 'Proje oluşturulurken bir hata oluştu.' };
    }

    redirect('/dashboard/projects');
}
// ... existing imports

export async function updateProject(id: string | number, prevState: any, formData: FormData) {
    const clientType = formData.get('clientType') as string;
    const clientName = formData.get('clientName') as string;
    const companyName = formData.get('companyName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const country = formData.get('country') as string;
    const city = formData.get('city') as string;
    const district = formData.get('district') as string;

    const description = formData.get('description') as string;
    const agreedPrice = parseFloat(formData.get('agreedPrice') as string);
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const status = formData.get('status') as string;

    if (!description || !startDate || !endDate) {
        return { error: 'Lütfen zorunlu alanları doldurun.' };
    }

    try {
        await firestore.collection('projects').doc(String(id)).update({
            clientType,
            clientName: clientName || null,
            companyName: companyName || null,
            phone: phone || null,
            email: email || null,
            country: country || null,
            city: city || null,
            district: district || null,
            description,
            agreedPrice: isNaN(agreedPrice) ? 0 : agreedPrice,
            startDate: admin.firestore.Timestamp.fromDate(new Date(startDate)),
            endDate: admin.firestore.Timestamp.fromDate(new Date(endDate)),
            status: status || 'Open',
            updatedAt: admin.firestore.Timestamp.now(),
        });

        revalidatePath(`/dashboard/projects/${id}`);
        revalidatePath('/dashboard/projects');
        revalidatePath('/dashboard/calendar');
        revalidatePath('/'); // dashboard
    } catch (error) {
        console.error('updateProject error', error);
        return { error: 'Proje güncellenirken bir hata oluştu.' };
    }

    redirect(`/dashboard/projects/${id}`);
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

export async function deleteProject(id: string | number) {
    const projectId = String(id);

    try {
        const projectRef = firestore.collection('projects').doc(projectId);

        // 1) Root collection’larda projectId ile bağlı olanları SİL
        await Promise.all([
            deleteCollectionDocs(firestore.collection('glassOrders').where('projectId', '==', projectId)),
            deleteCollectionDocs(firestore.collection('productionJobs').where('projectId', '==', projectId)),
            deleteCollectionDocs(firestore.collection('serviceRequests').where('projectId', '==', projectId)),
        ]);

        // 2) Project altı subcollection’lar (varsa) -> SİL
        const subcollections = ['payments', 'logs', 'expenses', 'services', 'production', 'glassOrders'] as const;

        for (const sub of subcollections) {
            await deleteCollectionDocs(projectRef.collection(sub));
        }

        // 3) Projeyi sil
        await projectRef.delete();

        // 4) Revalidate (ilgili sayfalar güncellensin)
        revalidatePath('/dashboard/projects');
        revalidatePath('/dashboard/glass-orders');
        revalidatePath('/dashboard/production');
        revalidatePath('/dashboard/services');
        revalidatePath('/dashboard/calendar');
        revalidatePath('/'); // dashboard
    } catch (error) {
        console.error('deleteProject error', error);
    }

    redirect('/dashboard/projects');
}