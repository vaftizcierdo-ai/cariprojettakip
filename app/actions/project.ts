'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function toggleProjectStatus(id: number, currentStatus: string) {
    const newStatus = currentStatus === 'Completed' ? 'Open' : 'Completed';

    await prisma.project.update({
        where: { id },
        data: { status: newStatus }
    });

    revalidatePath('/projects');
    revalidatePath(`/projects/${id}`);
}

export async function deleteProject(id: number) {
    await prisma.project.delete({
        where: { id }
    });

    revalidatePath('/projects');
    redirect('/projects');
}
