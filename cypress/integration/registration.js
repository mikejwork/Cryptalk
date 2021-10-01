describe("Registration", () => {
  it("navigate to registration page", () => {
    cy.visit("/authentication");
    cy.get("#cypress-usernameField").should("exist");
    cy.get("#cypress-passwordField").should("exist");
    cy.get("#cypress-toRegistration").should("exist");
    cy.get("#cypress-toRegistration").click();
  })

  it("renders main page correctly", () => {
    cy.get("#cypress-registrationMain").should("exist");
  })

  it("terms & conditions readable", () => {
    cy.get("#cypress-termsLink").should("exist");
    cy.get("#cypress-termsLink").click();
    cy.get("#cypress-termsPage").should("exist");
    cy.get("#cypress-backToMain").click();
  })

  it("privacy policy readable", () => {
    cy.get("#cypress-privacyLink").should("exist");
    cy.get("#cypress-privacyLink").click();
    cy.get("#cypress-privacyPage").should("exist");
    cy.get("#cypress-backToMain").click();
  })
})
