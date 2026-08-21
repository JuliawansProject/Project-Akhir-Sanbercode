class projectPage {
  visitPage() {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      { failOnStatusCode: false }
    );

    cy.get('input[name="username"]', { timeout: 30000 })
      .should("exist")
      .and("be.visible");
  }
}

//----Intercept Login----
// Request URL
// https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages
// Request Method
// GET
// Request URL
// https://opensource-demo.orangehrmlive.com/web/images/ohrm_branding.png?v=1783336755185
// Request Method
// GET
// Request URL
// https://opensource-demo.orangehrmlive.com/web/images/ohrm_logo.png
// Request Method
// GET
// Request URL
// https://opensource-demo.orangehrmlive.com/web/dist/img/blob.svg
// Request Method
// GET
// Request URL
// https://opensource-demo.orangehrmlive.com/web/dist/js/app.js?v=1783336755185
// Request Method
// GET
// Request URL
// https://opensource-demo.orangehrmlive.com/web/dist/js/chunk-vendors.js?v=1783336755185
// Request Method
// GET
// Request URL
// https://opensource-demo.orangehrmlive.com/web/dist/css/app.css?v=1783336755185
// Request Method
// GET
// Request URL
// https://opensource-demo.orangehrmlive.com/web/dist/css/chunk-vendors.css?v=1783336755185
// Request Method
// GET
// Request URL
// https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
// Request Method
// GET


//----Intercept Directory----
Request URL
https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages
Request Method
GET

2 / 31 requests
4.4 kB / 108 kB transferred
3.1 kB / 4,086 kB resources
Finish: 3.01 s
DOMContentLoaded: 723 ms
Request URL
https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/directory/employees?limit=14&offset=0
Request Method
GET
export default new projectPage();