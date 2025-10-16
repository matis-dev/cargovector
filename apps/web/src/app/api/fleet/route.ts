import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { initFirebaseAdmin } from '@/lib/firebase/admin';
import { getVehicles, addVehicle } from '@/lib/server/userService';

export async function GET(request: Request) {
  initFirebaseAdmin();
  try {
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const vehicles = await getVehicles(decodedToken.uid);

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  initFirebaseAdmin();
  try {
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const body = await request.json();

    const newVehicle = await addVehicle(decodedToken.uid, body);

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
