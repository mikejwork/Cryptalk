describe("Home page", () => {
  it("renders correctly", () => {
    cy.visit("/");
    cy.get("#cypress-home").should("exist");
  });

  it("renders get started button", () => {
    cy.get("#cypress-getStarted").should("exist");
  });

  it("button redirects when clicked", () => {
    cy.get('#cypress-getStarted').click()
    cy.location('pathname').should('eq', '/authentication')
  });
});
