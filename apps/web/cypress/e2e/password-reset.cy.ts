describe('Password Reset Flow', () => {
  const testEmail = 'testuser@example.com';
  const initialPassword = 'password123';
  const newPassword = 'newSecurePassword456';

  beforeEach(() => {
    // Create a user in the emulator before each test
    cy.task('createUser', { email: testEmail, password: initialPassword });
    cy.visit('/en');
  });

  afterEach(() => {
    // Clean up the user from the emulator after each test
    cy.task('deleteUserByEmail', testEmail);
  });

  it('should allow a user to request a reset link, reset their password, and log in', () => {
    // --- Request Password Reset ---
    cy.contains('Forgot Password').click();
    cy.url().should('include', '/forgot-password');
    cy.get('h2').should('contain', 'Forgot Your Password?');

    cy.get('#email-address').type(testEmail);
    cy.get('button[type="submit"]').click();

    // Check for confirmation message on the UI
    cy.contains('Password reset email sent. Please check your inbox.').should('be.visible');

    // --- Reset Password ---
    // Get the password reset link from the emulator via a task
    cy.task('generatePasswordResetLink', testEmail).then((link) => {
      // The link from Firebase Admin SDK is for the API, not the web UI.
      // We need to extract the oobCode and construct the UI URL.
      const url = new URL(link as string);
      const oobCode = url.searchParams.get('oobCode');
      
      cy.visit(`/en/reset-password?oobCode=${oobCode}`);

      cy.get('h2').should('contain', 'Reset Your Password');

      cy.get('#password').type(newPassword);
      cy.get('#confirmPassword').type(newPassword);
      cy.get('button[type="submit"]').click();

      // Check for success message and redirection
      cy.contains('Password has been reset successfully').should('be.visible');
      cy.url().should('include', '/en/login');

      // --- Verify New Password ---
      // Attempt to log in with the new password
      cy.get('#email').type(testEmail);
      cy.get('#password').type(newPassword);
      cy.get('button[type="submit"]').click();

      // Should redirect to dashboard on successful login
      cy.url().should('include', '/en/dashboard');
    });
  });
});
