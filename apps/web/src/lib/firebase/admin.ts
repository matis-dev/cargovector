import * as admin from 'firebase-admin';

export function initFirebaseAdmin() {
  if (!admin.apps.length) {
    // Only initialize Firebase Admin if the service account key is available
    // This prevents errors during Next.js build when environment variables might not be fully loaded
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } else {
      console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not defined. Firebase Admin SDK will not be initialized.');
      // Optionally, you could throw an error here if Firebase Admin is strictly required for all server-side operations
      // throw new Error('Firebase Admin SDK initialization failed: FIREBASE_SERVICE_ACCOUNT_KEY is missing.');
    }
  }
}
