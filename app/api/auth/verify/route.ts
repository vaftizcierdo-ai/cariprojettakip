import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

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
    const cookies = request.cookies;
    const idToken = cookies.get('__session')?.value;

    if (!idToken) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    return NextResponse.json({ valid: true, uid: decoded.uid });
  } catch (err) {
    console.error('Token verify error:', err);
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
