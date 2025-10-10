import { beforeAll, afterAll, vi } from 'vitest';
import * as admin from 'firebase-admin';
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  // Initialize Firebase Admin SDK
  admin.initializeApp({
    projectId: 'demo-project', // Use a demo project ID for testing
  });

  // Initialize the Firebase Test Environment
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-project',
    firestore: {
      rules: '', // No specific rules needed for functions testing, or load from firestore.rules
      host: '127.0.0.1',
      port: 8080,
    },
    auth: {
      host: '127.0.0.1',
      port: 9099,
    },
  });

  // Clear data before each test suite
  await testEnv.clearFirestore();
});

afterAll(async () => {
  // Clean up the test environment
  await testEnv.cleanup();
});

// Mock Firebase Functions config if needed
vi.mock('firebase-functions', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    config: vi.fn(() => ({
      // Define any config variables your functions might use
      // example: some_service: { key: 'test-key' }
    })),
  };
});
