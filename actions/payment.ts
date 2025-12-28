'use server';

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function addPayment(prevState: any, formData: FormData) {
    const projectId = parseInt(formData.get('projectId') as string);
    const amount = parseFloat(formData.get('amount') as string);
    const date = formData.get('date') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;

    if (!amount || !date || !type) {
        return { error: 'Lütfen zorunlu alanları doldurun.' };
    }

    try {
        await prisma.payment.create({
            data: {
                projectId,
                amount,
                date: new Date(date),
                type,
                description,
            },
        });

        revalidatePath(`/projects/${projectId}`);
    } catch (error) {
        return { error: 'Ödeme eklenirken hata oluştu.' };
    }

    redirect(`/projects/${projectId}`);
}
