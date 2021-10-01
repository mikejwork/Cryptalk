describe("Logout", () => {
  it("go to login page", () => {
    cy.visit("/authentication");
    cy.get("#cypress-usernameField").should("exist");
    cy.get("#cypress-passwordField").should("exist");
  })

  it("login", () => {
    cy.get('#cypress-usernameField').type('CypressTestAccount');
    cy.get('#cypress-passwordField').type('cypress123');
    cy.get('#cypress-signIn').click();
    cy.location('pathname').should('eq', '/channels')
  })

  it("logout functionality", () => {
    cy.get('#cypress-navMenu').click();
    cy.get("#cypress-navLogout").should("exist");
    cy.get('#cypress-navLogout').click();
    cy.get("#cypress-navLogin").should("exist");
  })
})
