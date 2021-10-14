describe("Recovery", () => {
  it("renders", () => {
    cy.visit("/authentication");
    cy.get("#cypress-recoveryLink").should("exist");
    cy.get("#cypress-recoveryLink").click();
    cy.get("#cypress-recoveryPage").should("exist");
  })

  it("return to login page", () => {
    cy.get("#cypress-returnToLogin").should("exist");
    cy.get("#cypress-returnToLogin").click();
    cy.get("#cypress-recoveryLink").should("exist");
  })
})
