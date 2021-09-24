describe("Footer", () => {
  it("renders correctly", () => {
    cy.visit("/");
    cy.get("#cypress-footerDiv").should("exist");
  });

  it("is openable", () => {
    cy.get("#cypress-footerBtn").click()
    cy.get("#cypress-footerAnimated").should('have.css', 'margin-left', '0px')
  });

  it("terms & conditions openable", () => {
    cy.get("#cypress-terms").click()
    cy.location('pathname').should('eq', '/terms')
  });

  it("privacy policy openable", () => {
    cy.get("#cypress-footerBtn").click()
    cy.get("#cypress-footerAnimated").should('have.css', 'margin-left', '0px')
    cy.get("#cypress-privacy").click()
    cy.location('pathname').should('eq', '/privacy')
  });
});
