import { vi } from 'vitest';

export const signInWithEmailAndPassword = vi.fn();
export const signOut = vi.fn().mockResolvedValue(undefined);

const mockUser = {
  uid: 'test-user-id',
  email: 'test@example.com',
  // add other user properties if needed
};

export const getAuth = vi.fn(() => ({
  currentUser: mockUser,
  onAuthStateChanged: vi.fn((callback) => {
    // Simulate the initial auth state
    callback(mockUser);
    // Return an unsubscribe function
    return () => {};
  }),
  signOut,
}));
