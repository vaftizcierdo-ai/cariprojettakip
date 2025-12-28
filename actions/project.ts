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
