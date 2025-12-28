'use server';

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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
        const project = await prisma.project.create({
            data: {
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
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status: status || 'Open',
            },
        });

        revalidatePath('/projects');
        revalidatePath('/calendar');
        revalidatePath('/'); // dashboard
    } catch (error) {
        console.error(error);
        return { error: 'Proje oluşturulurken bir hata oluştu.' };
    }

    redirect('/projects');
}
// ... existing imports

export async function updateProject(id: number, prevState: any, formData: FormData) {
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
        await prisma.project.update({
            where: { id },
            data: {
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
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status: status || 'Open',
            },
        });

        revalidatePath(`/projects/${id}`);
        revalidatePath('/projects');
        revalidatePath('/calendar');
        revalidatePath('/'); // dashboard
    } catch (error) {
        console.error(error);
        return { error: 'Proje güncellenirken bir hata oluştu.' };
    }

    redirect(`/projects/${id}`);
}
