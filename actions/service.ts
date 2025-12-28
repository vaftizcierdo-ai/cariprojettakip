'use server';

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createServiceRequest(prevState: any, formData: FormData) {
    const projectId = parseInt(formData.get('projectId') as string);
    const complaintDate = formData.get('complaintDate') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as string;

    if (!projectId || !complaintDate || !description) {
        return { error: 'Lütfen zorunlu alanları doldurun.' };
    }

    try {
        await prisma.serviceRequest.create({
            data: {
                projectId,
                complaintDate: new Date(complaintDate),
                description,
                status: status || 'Open',
            },
        });

        revalidatePath('/services');
    } catch (error) {
        return { error: 'Servis talebi oluşturulurken hata oluştu.' };
    }

    redirect('/services');
}

export async function updateServiceRequest(id: number, prevState: any, formData: FormData) {
    const status = formData.get('status') as string;
    const resolutionNote = formData.get('resolutionNote') as string;

    try {
        const data: any = { status };
        if (resolutionNote) {
            data.resolutionNote = resolutionNote;
            data.resolutionDate = new Date(); // Auto set date if note added? Or check if status changed to Solved?
        }

        if (status === 'Solved' && !data.resolutionDate) {
            data.resolutionDate = new Date();
        }

        await prisma.serviceRequest.update({
            where: { id },
            data
        });

        revalidatePath('/services');
    } catch (error) {
        return { error: 'Güncellenirken hata oluştu.' };
    }

    redirect('/services');
}
