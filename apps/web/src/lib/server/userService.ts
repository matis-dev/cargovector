import * as admin from 'firebase-admin';
import { initFirebaseAdmin } from '@/lib/firebase/admin';

initFirebaseAdmin();

export async function getUserProfile(uid: string, email?: string) {
    const userDoc = await admin.firestore().collection('users').doc(uid).get();

    if (!userDoc.exists) {
        const newUserProfile = {
            email: email,
            companyName: 'New Company',
            address: '',
            memberSince: new Date().toISOString(),
            roles: ['Shipper']
        };
        await admin.firestore().collection('users').doc(uid).set(newUserProfile);
        return { uid, ...newUserProfile };
    }

    return { uid, ...userDoc.data() };
}

interface UserProfile {
    email?: string;
    companyName?: string;
    address?: string;
    memberSince?: string;
    roles?: string[];
}

interface VehicleData {
    name: string;
    licensePlate: string;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
    await admin.firestore().collection('users').doc(uid).update(data);
}

export async function getVehicles(uid: string) {
    const snapshot = await admin.firestore().collection('users').doc(uid).collection('vehicles').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addVehicle(uid: string, vehicleData: VehicleData) {
    const docRef = await admin.firestore().collection('users').doc(uid).collection('vehicles').add(vehicleData);
    return { id: docRef.id, ...vehicleData };
}

export async function removeVehicle(uid: string, vehicleId: string) {
    await admin.firestore().collection('users').doc(uid).collection('vehicles').doc(vehicleId).delete();
}
