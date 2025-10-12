import { defineConfig } from 'cypress';
import { createUser, deleteUserByEmail, generatePasswordResetLink } from './cypress/support/firebase-admin';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      on('task', {
        createUser,
        deleteUserByEmail,
        generatePasswordResetLink,
      });

      return config;
    },
  },
});
