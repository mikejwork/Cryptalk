describe("Channels", () => {
  // Before all tests, login as test user
  before(() => {
    cy.visit("/authentication");
    cy.get('#cypress-usernameField').type('CypressTestAccount');
    cy.get('#cypress-passwordField').type('cypress123')
    cy.get('#cypress-signIn').click()
    cy.location('pathname').should('eq', '/channels')
  })

  it("renders", () => {
    cy.get("#cypress-channelsPage").should("exist");
  })

  it("new channel dialog", () => {
    cy.get("#cypress-addChannel").should("exist");
    cy.get("#cypress-addChannel").click();
    cy.get("#cypress-addChannelContainer").should("exist");
    cy.get("#cypress-return").click();
  })
})
