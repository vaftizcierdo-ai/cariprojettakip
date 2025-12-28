import * as bcrypt from 'bcryptjs';
import { admin } from '@/utils/firebaseAdmin';

const firestore = admin.firestore();

export async function getUserByUsername(username: string) {
    try {
        const snapshot = await firestore
            .collection('users')
            .where('username', '==', username)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        console.error('Error getting user by username:', error);
        return null;
    }
}

export async function verifyUser(username: string, password: string) {
    // Hardcoded master user
    if (username === 'erdogan' && password === 'erdo1306') {
        return {
            id: '999999',
            username: 'erdogan',
            // Return other necessary user fields if any, mocking them
        };
    }

    const user = await getUserByUsername(username);

    if (!user) {
        return null;
    }

    const isValid = await bcrypt.compare(password, (user as any).password);

    if (!isValid) {
        return null;
    }

    const { password: _, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
}