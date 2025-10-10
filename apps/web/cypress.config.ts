import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      on('task', {
        waitForEmulator: () => {
          return new Promise(resolve => {
            const check = () => {
              fetch('http://127.0.0.1:9098').then(res => {
                if (res.ok) {
                  resolve(true);
                } else {
                  setTimeout(check, 1000);
                }
              }).catch(() => {
                setTimeout(check, 1000);
              });
            };
            check();
          });
        },
        deleteUserByEmail: async (email) => {
          console.log(`Attempting to delete user: ${email}`);
          const deleteUrl = 'http://127.0.0.1:5001/cargovector-e710f/us-central1/deleteTestUser';
          try {
            const response = await fetch(deleteUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email }),
            });

            if (!response.ok) {
              const errorBody = await response.text();
              console.error(`Error response from delete function: ${response.status} ${errorBody}`);
              return false;
            }

            const responseBody = await response.json();
            console.log('Successfully called delete function:', responseBody);
            return true;
          } catch (error) {
            console.error(`Network or other error deleting user ${email}:`, error);
            return false;
          }
        },
      });
    },
  },
});
