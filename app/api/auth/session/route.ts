import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

export const runtime = 'nodejs';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) return NextResponse.json({ error: 'No idToken' }, { status: 400 });

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in ms
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    const isProd = process.env.NODE_ENV === 'production';
    const maxAge = Math.floor(expiresIn / 1000);

    const cookie = `__session=${sessionCookie}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Strict${isProd ? '; Secure' : ''}`;

    return NextResponse.json({ success: true }, { status: 200, headers: { 'Set-Cookie': cookie } });
  } catch (err) {
    console.error('session create error', err);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
  }
}
