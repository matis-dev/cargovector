describe('Email Verification', () => {
  it('should show the success page for a valid verification link', () => {
    // This is difficult to test in a true E2E fashion without a real email.
    // We will simulate the redirect by visiting the page directly.
    cy.visit('/verification-success');
    cy.contains('Email Verified!').should('be.visible');
    cy.contains('Go to Login').should('be.visible');
  });

  it('should show the failure page for an invalid verification link', () => {
    // We will simulate the redirect by visiting the page directly.
    cy.visit('/verification-failure');
    cy.contains('Verification Failed').should('be.visible');
    cy.contains('Go back to registration').should('be.visible');
  });
});
