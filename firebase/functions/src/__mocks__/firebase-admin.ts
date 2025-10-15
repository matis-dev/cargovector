import {vi} from "vitest";

export const mockSet = vi.fn();
export const mockUpdate = vi.fn();
export const mockDelete = vi.fn();
export const mockGet = vi.fn();
export const mockDoc = vi.fn(() => ({
  set: mockSet,
  update: mockUpdate,
  delete: mockDelete,
  get: mockGet,
}));

export const mockCollection = vi.fn((path: string) => ({
  doc: mockDoc,
  get: mockGet,
}));

const firebaseAdminMock = {
  initializeApp: vi.fn(),
  firestore: vi.fn(() => ({
    FieldValue: {
      serverTimestamp: vi.fn(() => "MOCKED_TIMESTAMP"),
    },
    collection: mockCollection,
  })),
};

export default firebaseAdminMock;
