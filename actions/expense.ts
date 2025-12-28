'use server';

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function addExpense(prevState: any, formData: FormData) {
    const projectId = parseInt(formData.get('projectId') as string);
    const amount = parseFloat(formData.get('amount') as string);
    const date = formData.get('date') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    if (!amount || !date || !category) {
        return { error: 'Lütfen zorunlu alanları doldurun.' };
    }

    try {
        await prisma.expense.create({
            data: {
                projectId,
                amount,
                date: new Date(date),
                category,
                description,
            },
        });

        revalidatePath(`/projects/${projectId}`);
        revalidatePath('/financial-status');
    } catch (error) {
        return { error: 'Gider eklenirken hata oluştu.' };
    }

    redirect(`/projects/${projectId}`);
}
