describe('My First Test', () => {
  it('visits the app', () => {
    cy.visit('/');
    cy.contains('Get started by editing');
  });
});
