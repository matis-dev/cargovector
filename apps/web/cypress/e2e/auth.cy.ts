
describe('Authentication Flow', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'password123';
  let idToken: string;

  before(() => {
    cy.task('waitForEmulator');
    // Create a user for testing login and logout
    cy.request({
      method: 'POST',
      url: `http://localhost:9098/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`,
      body: {
        email: testEmail,
        password: testPassword,
        returnSecureToken: true,
      },
    }).then(response => {
      expect(response.status).to.eq(200);
      idToken = response.body.idToken;
    });
  });

  after(() => {
    // Clean up the created user using the custom task
    cy.task('deleteUserByEmail', testEmail).then(success => {
      expect(success).to.be.true;
    });
  });

  it('should allow a user to visit the login page', () => {
    cy.visit('/en/login');
    cy.contains('Sign in to your account').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });

  it('should show an error message with invalid credentials', () => {
    cy.visit('/en/login');
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Firebase: Error (auth/user-not-found).').should('be.visible');
  });

  it('should allow a user to log in and redirect to the dashboard', () => {
    cy.visit('/en/login');
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type(testPassword);
    cy.get('button[type="submit"]').click();

    // Wait for redirection and check the URL
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome to your Dashboard!').should('be.visible');
  });

  it('should allow a logged-in user to log out', () => {
    // First, log in
    cy.visit('/en/login');
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type(testPassword);
    cy.get('button[type="submit"]').click();

    // Wait for dashboard and then log out
    cy.url().should('include', '/dashboard');
    cy.contains('Logout').click();

    // Wait for redirection to homepage and check URL
    cy.url().should('eq', Cypress.config().baseUrl + '/en');
  });
});
