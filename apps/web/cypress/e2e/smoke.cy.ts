describe('Smoke Test', () => {
  it('visits the login page', () => {
    cy.visit('/login');
    cy.contains('Sign in to your account');
  });
});
