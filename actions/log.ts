'use server';

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function addLog(prevState: any, formData: FormData) {
    const projectId = parseInt(formData.get('projectId') as string);
    const content = formData.get('content') as string;

    if (!content) {
        return { error: 'Lütfen içerik girin.' };
    }

    try {
        await prisma.projectLog.create({
            data: {
                projectId,
                content,
            },
        });

        // Auto update project updated_at? Prisma handles @updatedAt if field modified.
        // Adding log doesn't modify project row unless we touch it.
        // We might want to touch project.updatedAt?
        await prisma.project.update({
            where: { id: projectId },
            data: { updatedAt: new Date() }
        });

        revalidatePath(`/projects/${projectId}`);
    } catch (error) {
        return { error: 'Log eklenirken hata oluştu.' };
    }

    redirect(`/projects/${projectId}`);
}
