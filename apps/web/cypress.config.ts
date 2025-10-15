import { defineConfig } from 'cypress';
import { createUser, deleteUserByEmail, generatePasswordResetLink } from './cypress/support/firebase-admin';
import net from 'net';

// Function to check if a port is open
const isPortOpen = (port: number) =>
  new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, 'localhost');
  });

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
        async waitForEmulator() {
          let retries = 5;
          while (retries > 0) {
            const authReady = await isPortOpen(9098);
            const firestoreReady = await isPortOpen(8081);
            if (authReady && firestoreReady) {
              console.log('Emulators are ready!');
              return null;
            }
            console.log('Waiting for emulators...');
            await new Promise((res) => setTimeout(res, 1000));
            retries--;
          }
          throw new Error('Emulators did not start in time.');
        },
      });

      return config;
    },
  },
});
