describe("Profile", () => {
  // Before all tests, login as test user
  before(() => {
    cy.visit("/authentication");
    cy.get('#cypress-usernameField').type('CypressTestAccount');
    cy.get('#cypress-passwordField').type('cypress123')
    cy.get('#cypress-signIn').click()
    cy.location('pathname').should('eq', '/channels')
  })

  it("renders correctly", () => {
    cy.visit("/profile");
    cy.get("#cypress-profile").should("exist");
  })

  it("shows main view by default", () => {
    cy.get("#cypress-profileMain").should("exist");
  })

  it("shows username", () => {
    cy.get("#cypress-profileUsername").should('have.text', 'cypresstestaccount')
  })

  it("edit profile from avatar", () => {
    cy.get("#cypress-profileAvatarEdit").click()
    cy.get("#cypress-profileEdit").should("exist");
  })

  it("return to profile button works correctly", () => {
    cy.get("#cypress-returnToProfile").click()
    cy.get("#cypress-profile").should("exist");
  })

  it("change password button renders", () => {
    cy.get("#cypress-changePassword").should("exist");
  })

  it("change password button redirects", () => {
    cy.get("#cypress-changePassword").click()
    cy.get("#cypress-changePasswordPage").should("exist");
    cy.get("#cypress-returnToProfile").click()
    cy.get("#cypress-profile").should("exist");
  })

  it("two factor auth button renders", () => {
    cy.get("#cypress-twoFactor").should("exist");
  })
})
