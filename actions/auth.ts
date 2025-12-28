'use server';

import { verifyUser } from '@/services/userService';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import { redirect } from 'next/navigation';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this';
const key = new TextEncoder().encode(SECRET_KEY);

export async function login(prevState: any, formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const year = formData.get('year') as string;

    if (!username || !password || !year) {
        return { error: 'Please fill in all fields' };
    }

    const user = await verifyUser(username, password);

    if (!user) {
        return { error: 'Invalid username or password' };
    }

    // Create JWT
    const token = await new SignJWT({ sub: user.id.toString(), username: user.username, year })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(key);

    const cookieStore = await cookies(); // In Next.js 15 cookies() is async, Next 14 it is sync. Assuming 14 or latest 15.
    // Wait, Next.js 15: cookies() is async. Next.js 14: cookies().
    // I will assume async to be safe or await it if I can.
    // Actually, let's treat it as awaitable.
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    redirect('/');
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/login');
}
