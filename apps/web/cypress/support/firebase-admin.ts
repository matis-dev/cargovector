const admin = require('firebase-admin');

if (!admin.apps.length) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9098';
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8081';
  admin.initializeApp({
    projectId: 'cargovector-e710f',
  });
}

export const createUser = async ({
  email,
  password,
  customClaims,
  profile,
}: {
  email: string;
  password?: string;
  customClaims?: Record<string, any>;
  profile?: Record<string, any>;
}) => {
  try {
    let uid;
    try {
      const userRecord = await admin.auth().createUser({ email, password });
      uid = userRecord.uid;
    } catch (error) {
      if ((error as any).code === 'auth/email-already-exists') {
        const user = await admin.auth().getUserByEmail(email);
        uid = user.uid;
      } else {
        throw error;
      }
    }

    if (customClaims) {
      await admin.auth().setCustomUserClaims(uid, customClaims);
    }

    if (profile) {
      await admin.firestore().collection('users').doc(uid).set(profile);
    }

    return { uid };
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

export const deleteUserByEmail = async (email: string) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().deleteUser(user.uid);
    return true;
  } catch (error) {
    if ((error as any).code === 'auth/user-not-found') {
      return true; // Already deleted
    }
    console.error(`Error deleting user ${email}:`, error);
    return false;
  }
};

export const generatePasswordResetLink = async (email: string) => {
  try {
    const link = await admin.auth().generatePasswordResetLink(email);
    return link;
  } catch (error) {
    console.error(`Error generating password reset link for ${email}:`, error);
    return null;
  }
};
