
import projectPage from '../support/projectPage';
 
Cypress.Commands.add('login', (username, password) => {
  projectPage.visitLoginPage();
  projectPage.login(username, password);
  cy.url().should('include', '/dashboard/index');
});
 