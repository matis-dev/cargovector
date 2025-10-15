export const auth = () => ({ verifyIdToken: vi.fn() });
export const firestore = () => ({ collection: () => ({ doc: () => ({ get: vi.fn(), set: vi.fn(), update: vi.fn() }) }) });
