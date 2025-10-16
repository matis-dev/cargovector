import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { initFirebaseAdmin } from '@/lib/firebase/admin';
import { removeVehicle } from '@/lib/server/userService';

export async function DELETE(
  request: Request,
  { params }: { params: { vehicleId: string } }
) {
  initFirebaseAdmin();
  try {
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const vehicleId = params.vehicleId;

    await removeVehicle(decodedToken.uid, vehicleId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
