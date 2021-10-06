describe("Login", () => {
  it("renders correctly", () => {
    cy.visit("/authentication");
    cy.get("#cypress-usernameField").should("exist");
    cy.get("#cypress-passwordField").should("exist");
  })

  it("login functionality", () => {
    cy.get('#cypress-usernameField').type('CypressTestAccount');
    cy.get('#cypress-passwordField').type('cypress123');
    cy.get('#cypress-signIn').click();
  })

  it("login redirects to channels page", () => {
    cy.location('pathname').should('eq', '/channels');
  })
})
