import { getAuth, signInWithEmailAndPassword, signOut } from './firebase-auth';

export const auth = {
  getAuth: getAuth,
  signInWithEmailAndPassword: signInWithEmailAndPassword,
  signOut: signOut,
};
