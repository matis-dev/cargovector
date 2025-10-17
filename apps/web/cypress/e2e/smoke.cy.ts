describe('Smoke Test', () => {
  it('visits the login page', () => {
    cy.visit('/en/login');
    cy.contains('Sign in to your account');
  });
});
