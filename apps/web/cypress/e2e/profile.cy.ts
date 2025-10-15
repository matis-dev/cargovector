describe('Profile and Fleet Management', () => {
  const testEmail = `shipper-${Date.now()}@example.com`;
  const testPassword = 'password123';

  beforeEach(() => {
    cy.task('waitForEmulator');
    cy.task('createUser', {
      email: testEmail,
      password: testPassword,
      customClaims: { roles: ['Shipper'] },
      profile: { companyName: 'Test Co', address: '123 Test St' },
    });

    // Intercept the Firebase getIdToken network request
    cy.intercept('POST', 'https://securetoken.googleapis.com/**', {
      statusCode: 200,
      body: {
        id_token: 'mock-id-token',
        refresh_token: 'mock-refresh-token',
        expires_in: '3600',
      },
    }).as('getIdToken');

    // Intercept the profile API call and provide a mock response
    cy.intercept('GET', '/api/users/me', {
      statusCode: 200,
      body: {
        companyName: 'Test Co',
        address: '123 Test St',
        email: testEmail,
        memberSince: '2023-01-01',
        roles: ['Shipper'],
      },
    }).as('getProfile');

    // Intercept the profile update API call
    cy.intercept('PUT', '/api/users/me', {
      statusCode: 200,
      body: { message: 'Profile updated successfully' },
    }).as('updateProfile');

    // Intercept the fleet API call
    cy.intercept('GET', '/api/fleet', {
      statusCode: 200,
      body: [
        { id: 'vehicle1', name: 'Old Truck', licensePlate: 'OLD-123' },
      ],
    }).as('getFleet');

    // Intercept the add vehicle API call
    cy.intercept('POST', '/api/fleet', {
      statusCode: 201,
      body: { id: 'vehicle2', name: 'Big Truck', licensePlate: 'TRUCK-123' },
    }).as('addVehicle');

    // Log in as the created user
    cy.visit('/login');
    cy.get('input[name="email"]').type(testEmail); // Add email input
    cy.get('input[name="password"]').type(testPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  afterEach(() => {
    cy.task('deleteUserByEmail', testEmail);
  });

  it('should display the profile page and allow editing', () => {
    // Navigate to profile page by clicking a link from the dashboard
    cy.contains('a', 'Profile').click();
    cy.url().should('include', '/profile');
    cy.wait('@getProfile');    // 1. Verify initial data is displayed
    cy.contains('h1', 'Company Profile');
    cy.contains('Test Co').should('be.visible');
    cy.contains(testEmail).should('be.visible');

    // 2. Enter edit mode
    cy.contains('button', 'Edit').click();

    // 3. Edit the form
    cy.get('input[name="companyName"]').clear().type('Updated Test Co');
    cy.get('input[name="address"]').clear().type('456 New St');

    // 4. Save the changes
    cy.contains('button', 'Save').click();
    cy.wait('@updateProfile');

    // 5. Verify the updated information is displayed
    cy.contains('h1', 'Company Profile');
    cy.contains('Updated Test Co').should('be.visible');
    cy.contains('456 New St').should('be.visible');
  });

  it('should allow a shipper to manage their fleet', () => {
    // Navigate to profile page by clicking a link from the dashboard
    cy.contains('a', 'Profile').click();
    cy.url().should('include', '/profile');
    cy.wait('@getProfile');
    cy.wait('@getFleet');
    cy.get('h2').contains('Fleet Management').should('be.visible');

    // Intercept the fleet API call to return the updated fleet after adding a vehicle
    cy.intercept('GET', '/api/fleet', {
      statusCode: 200,
      body: [
        { id: 'vehicle1', name: 'Old Truck', licensePlate: 'OLD-123' },
        { id: 'vehicle2', name: 'Big Truck', licensePlate: 'TRUCK-123' },
      ],
    }).as('getUpdatedFleet');

    // 1. Add a new vehicle
    cy.get('input[name="name"]').type('Big Truck');
    cy.get('input[name="licensePlate"]').type('TRUCK-123');
    cy.contains('button', 'Add Vehicle').scrollIntoView().click({ force: true });

    cy.wait('@addVehicle');
    cy.wait('@getUpdatedFleet');

    // 2. Verify the new vehicle is in the list
    cy.contains('.font-medium', 'Big Truck').should('be.visible');
    cy.contains('.text-sm', 'TRUCK-123').should('be.visible');

    // Intercept the remove vehicle API call
    cy.intercept('DELETE', '/api/fleet/vehicle2', {
      statusCode: 200,
      body: { message: 'Vehicle removed successfully' },
    }).as('removeVehicle');

    // 3. Remove the vehicle
    cy.contains('.font-medium', 'Big Truck').parents('.flex').within(() => {
      cy.contains('button', 'Remove').click();
    });

    cy.wait('@removeVehicle');

    // 4. Verify the vehicle is removed
    cy.contains('.font-medium', 'Big Truck').should('not.exist');
  });
});