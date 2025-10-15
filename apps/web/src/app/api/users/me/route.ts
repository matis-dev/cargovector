import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { initFirebaseAdmin } from '@/lib/firebase/admin';
import { getUserProfile, updateUserProfile } from '@/lib/server/userService';

initFirebaseAdmin();

export async function GET(request: Request) {
  try {
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const profile = await getUserProfile(decodedToken.uid, decodedToken.email);

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const body = await request.json();

    await updateUserProfile(decodedToken.uid, body);

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
