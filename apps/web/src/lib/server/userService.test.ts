import { getUserProfile, updateUserProfile } from './userService';
import * as admin from 'firebase-admin';

vi.mock('@/lib/firebase/admin', () => ({
  initFirebaseAdmin: vi.fn(),
}));

const mockUserDocGet = vi.fn();
const mockUserDocSet = vi.fn();
const mockUserDocUpdate = vi.fn();

vi.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: () => ({
      doc: () => ({
        get: mockUserDocGet,
        set: mockUserDocSet,
        update: mockUserDocUpdate,
      }),
    }),
  }),
}));

describe('Server UserService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should return user profile if user exists', async () => {
      mockUserDocGet.mockResolvedValue({ exists: true, data: () => ({ companyName: 'Test Co' }) });

      const profile = await getUserProfile('test-uid');

      expect(profile).toEqual({ uid: 'test-uid', companyName: 'Test Co' });
    });

    it('should create and return a new profile if user does not exist', async () => {
      mockUserDocGet.mockResolvedValue({ exists: false });

      const profile = await getUserProfile('test-uid', 'new@example.com');

      expect(mockUserDocSet).toHaveBeenCalled();
      expect(profile.email).toBe('new@example.com');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile', async () => {
      mockUserDocUpdate.mockResolvedValue({});

      await updateUserProfile('test-uid', { companyName: 'Updated Co' });

      expect(mockUserDocUpdate).toHaveBeenCalledWith({ companyName: 'Updated Co' });
    });
  });
});
