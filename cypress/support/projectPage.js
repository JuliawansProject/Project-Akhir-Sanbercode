class ProjectPage {
  // =========================================================
  // ACTION - Navigation
  // =========================================================
  visitLoginPage() {
    cy.visit("/web/index.php/auth/login", { failOnStatusCode: false });
    cy.get('input[name="username"]', { timeout: 30000 })
      .should("exist")
      .and("be.visible");
  }

  visitDashboard() {
    cy.visit("/web/index.php/dashboard/index", { failOnStatusCode: false });
  }

    visitDirectoryPage() {
    cy.visit("/web/index.php/directory/viewDirectory", {
      failOnStatusCode: false,
    });
    cy.location("pathname", { timeout: 15000 }).then((pathname) => {
      if (pathname.includes("/auth/login")) {
        cy.visit("/web/index.php/directory/viewDirectory", {
          failOnStatusCode: false,
        });
      }
    });

    cy.contains("h5", "Directory", { timeout: 15000 }).should("be.visible");
  }

  visitRecruitmentPage() {
    cy.visit("/web/index.php/recruitment/viewCandidates", {
      failOnStatusCode: false,
    });
  }

  // =========================================================
  // ACTION - Login
  // =========================================================
  fillUsername(username) {
    cy.get('input[name="username"]').clear().type(username, { delay: 0 });
  }

  fillPassword(password) {
    cy.get('input[name="password"]').clear().type(password, { delay: 0 });
  }

  clickLoginButton() {
    cy.get('button[type="submit"]').click();
  }

  login(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLoginButton();
  }

  clickForgotPasswordLink() {
    cy.contains("Forgot your password?").click();
  }

  // =========================================================
  // ASSERTION - Login
  // =========================================================
  verifyLoginPageIsDisplayed() {
    cy.get('input[name="username"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("contain.text", "Login");
  }

  verifyLoginSuccess() {
    cy.url({ timeout: 20000 }).should("include", "/dashboard/index");
    cy.contains("Dashboard", { timeout: 20000 }).should("be.visible");
  }

  verifyLoginFailed() {
    cy.contains("Invalid credentials", { timeout: 20000 }).should("be.visible");
  }

  verifyRequiredFieldMessage() {
    cy.contains("Required").should("be.visible");
  }

  verifyForgotPasswordPage() {
    cy.url().should("include", "/auth/requestPasswordResetCode");
    cy.contains("Reset Password").should("be.visible");
  }

  // =========================================================
  // INTERCEPT - LOGIN (8 test cases -> 8 distinct intercepts)
  // =========================================================
  interceptLoginValidCredentials() {
    cy.intercept("POST", "**/auth/validate").as("loginValidCredentials");
  }
  waitLoginValidCredentials() {
    cy.wait("@loginValidCredentials")
      .its("response.statusCode")
      .should("eq", 302);
  }

  interceptLoginInvalidPassword() {
    cy.intercept("POST", "**/auth/validate").as("loginInvalidPassword");
  }
  waitLoginInvalidPassword() {
    cy.wait("@loginInvalidPassword")
      .its("response.statusCode")
      .should("eq", 302);
  }

  interceptLoginInvalidUsername() {
    cy.intercept("POST", "**/auth/validate").as("loginInvalidUsername");
  }
  waitLoginInvalidUsername() {
    cy.wait("@loginInvalidUsername")
      .its("response.statusCode")
      .should("eq", 302);
  }

  interceptLoginInvalidBoth() {
    cy.intercept("POST", "**/auth/validate").as("loginInvalidBoth");
  }
  waitLoginInvalidBoth() {
    cy.wait("@loginInvalidBoth").its("response.statusCode").should("eq", 302);
  }

  interceptLoginEmptyBoth() {
    cy.intercept("POST", "**/auth/validate").as("loginEmptyBoth");
  }

  interceptLoginValidUserEmptyPass() {
    cy.intercept("POST", "**/auth/validate").as("loginValidUserEmptyPass");
  }

  interceptLoginEmptyUserValidPass() {
    cy.intercept("POST", "**/auth/validate").as("loginEmptyUserValidPass");
  }

  interceptForgotPassword() {
    cy.intercept("GET", "**/auth/requestPasswordResetCode").as(
      "forgotPasswordPage",
    );
  }
  waitForgotPassword() {
    cy.wait("@forgotPasswordPage").its("response.statusCode").should("eq", 200);
  }

 // =========================================================
  // ACTION - Directory
  // =========================================================
  visitDirectoryPage() {
    cy.visit("/web/index.php/directory/viewDirectory", {
      failOnStatusCode: false,
    });
    cy.location("pathname", { timeout: 15000 }).then((pathname) => {
      if (pathname.includes("/auth/login")) {
        cy.visit("/web/index.php/directory/viewDirectory", {
          failOnStatusCode: false,
        });
      }
    });
    cy.url({ timeout: 15000 }).should("include", "/directory/viewDirectory");

    cy.get("h5, h6", { timeout: 15000 })
      .contains("Directory")
      .should("be.visible");
  }
 
  fillDirectoryEmployeeName(name) {
    cy.get('input[placeholder="Type for hints..."]', { timeout: 10000 })
      .first()
      .clear()
      .type(name, { delay: 80 });
    cy.wait(600);
    cy.get("body").then(($body) => {
      const match = $body.find(`.oxd-autocomplete-option:contains('${name}')`);
      if (match.length) {
        cy.contains(".oxd-autocomplete-option", name).first().click();
      } else {
        cy.contains("h5", "Directory").click();
      }
    });
    cy.get('input[placeholder="Type for hints..."]')
      .first()
      .should("have.value", name);
  }
 
  selectDirectoryJobTitle(jobTitle) {
    cy.get(".oxd-select-text").eq(0).click();
    cy.get(".oxd-select-dropdown", { timeout: 10000 }).should("be.visible");
    cy.get(".oxd-select-option", { timeout: 10000 }).should(
      "have.length.greaterThan",
      0,
    );
  }
 
  selectDirectoryJobTitleDynamic() {
    this.selectDirectoryJobTitle();
    return cy
      .get(".oxd-select-option")
      .first()
      .invoke("text")
      .then((text) => {
        cy.get(".oxd-select-option").first().click();
        return cy.wrap(text.trim());
      });
  }
 
  selectDirectoryLocation(location) {
    cy.get(".oxd-select-text", { timeout: 10000 }).eq(1).click();
    cy.contains(".oxd-select-option", location, { timeout: 10000 }).click();
  }
 
  clickDirectorySearch() {
    cy.contains("button", "Search").click();
  }
 
  clickDirectoryReset() {
    cy.contains("button", "Reset").click();
  }
 
  clickEmployeeCardByName(name) {
    cy.contains("p.orangehrm-directory-card-header", name, { timeout: 15000 })
      .should("be.visible")
      .closest(".oxd-grid-item")
      .scrollIntoView()
      .click({ force: true });
    cy.wait(500);
  }
 
  clickAnyEmployeeCard() {
    cy.get(".oxd-grid-item", { timeout: 15000 })
      .filter(
        (i, el) =>
          Cypress.$(el).find("p.orangehrm-directory-card-header").length > 0,
      )
      .should("have.length.greaterThan", 0)
      .first()
      .scrollIntoView()
      .click({ force: true });
    cy.wait(500);
  }
 
  clickEmployeeEmailButton() {
    cy.get('a[href^="mailto:"]', { timeout: 10000 })
      .first()
      .click({ force: true });
  }
 
  clickEmployeePhoneButton() {
    cy.get('a[href^="tel:"]', { timeout: 10000 })
      .first()
      .click({ force: true });
  }
 
  // =========================================================
  // ASSERTION - Directory
  // =========================================================
  verifyDirectoryPageIsDisplayed() {
    cy.contains("h5", "Directory").should("be.visible");
    cy.get('input[placeholder="Type for hints..."]').should("be.visible");
  }
 
  verifyEmployeeFoundInDirectory(name) {
    cy.contains(name, { timeout: 15000 }).should("be.visible");
  }
 
  verifyNoRecordsFound() {
    cy.contains("No Records Found", { timeout: 15000 }).should("be.visible");
  }
 
  verifyEmployeeDetailIsDisplayed() {
    cy.get('a[href^="tel:"]', { timeout: 15000 }).should("exist");
    cy.get('a[href^="mailto:"]', { timeout: 15000 }).should("exist");
  }
 
  verifyEmployeeQrCodeIsDisplayed() {
    cy.get('canvas, img[alt*="qr" i], svg[class*="qr" i]', {
      timeout: 15000,
    }).should("exist");
  }
 
  verifyEmployeePhoneIconIsClickable() {
    cy.get('a[href^="tel:"]', { timeout: 15000 })
      .should("exist")
      .and("be.visible");
  }
 
  verifyEmployeeEmailIconIsClickable() {
    cy.get('a[href^="mailto:"]', { timeout: 15000 })
      .should("exist")
      .and("be.visible");
  }
 
  // =========================================================
  // INTERCEPT - DIRECTORY
  // =========================================================
  interceptDirectoryPageDisplay() {
    cy.intercept("GET", "**/api/v2/directory/embed/employees/photos*").as(
      "directoryPageDisplay",
    );
  }
  waitDirectoryPageDisplay() {
    cy.wait("@directoryPageDisplay")
      .its("response.statusCode")
      .should("eq", 200);
  }
 
  interceptDirectorySearchByEmployeeName() {
    cy.intercept("GET", "**/api/v2/directory/employees*").as(
      "directorySearchByEmployeeName",
    );
  }
  waitDirectorySearchByEmployeeName() {
    cy.wait("@directorySearchByEmployeeName")
      .its("response.statusCode")
      .should("eq", 200);
  }
 
  interceptDirectorySearchByJobTitle() {
    cy.intercept("GET", "**/api/v2/directory/employees*").as(
      "directorySearchByJobTitle",
    );
  }
  waitDirectorySearchByJobTitle() {
    cy.wait("@directorySearchByJobTitle")
      .its("response.statusCode")
      .should("eq", 200);
  }
 
  interceptDirectorySearchByLocation() {
    cy.intercept("GET", "**/api/v2/directory/employees*").as(
      "directorySearchByLocation",
    );
  }
  waitDirectorySearchByLocation() {
    cy.wait("@directorySearchByLocation")
      .its("response.statusCode")
      .should("eq", 200);
  }
 
  interceptDirectorySearchByInvalidEmployeeName() {
    cy.intercept("GET", "**/api/v2/directory/employees*").as(
      "directorySearchByInvalidEmployeeName",
    );
  }
  waitDirectorySearchByInvalidEmployeeName() {
    cy.wait("@directorySearchByInvalidEmployeeName")
      .its("response.statusCode")
      .should("eq", 200);
  }
 
  interceptDirectorySearchByInvalidJobTitle() {
    cy.intercept("GET", "**/api/v2/directory/employees*").as(
      "directorySearchByInvalidJobTitle",
    );
  }
  waitDirectorySearchByInvalidJobTitle() {
    cy.wait("@directorySearchByInvalidJobTitle")
      .its("response.statusCode")
      .should("eq", 200);
  }
 
  interceptDirectorySearchByInvalidLocation() {
    cy.intercept("GET", "**/api/v2/directory/employees*").as(
      "directorySearchByInvalidLocation",
    );
  }
  waitDirectorySearchByInvalidLocation() {
    cy.wait("@directorySearchByInvalidLocation")
      .its("response.statusCode")
      .should("eq", 200);
  }
  // =========================================================
  // ACTION - Recruitment
  // =========================================================
  selectRecruitmentJobTitle(jobTitle) {
    cy.contains("label.oxd-label", "Job Title")
      .parent()
      .find(".oxd-select-text", { timeout: 10000 })
      .click();
    cy.contains(".oxd-select-option", jobTitle, { timeout: 10000 }).click();
  }

  selectRecruitmentVacancy(vacancy) {
    cy.contains("label", "Vacancy").parent().find(".oxd-select-text").click();
    cy.contains(".oxd-select-option", vacancy).click();
  }

  selectRecruitmentHiringManager(manager) {
    cy.contains("label", "Hiring Manager")
      .parent()
      .find(".oxd-select-text")
      .click();
    cy.contains(".oxd-select-option", manager).click();
  }

  selectRecruitmentStatus(status) {
    cy.contains("label", "Status").parent().find(".oxd-select-text").click();
    cy.contains(".oxd-select-option", status).click();
  }

  fillRecruitmentCandidateName(name) {
    cy.get('input[placeholder="Type for hints..."]')
      .clear()
      .type(name, { delay: 50 });
    cy.contains(".oxd-autocomplete-option", name, { timeout: 10000 }).click();
  }

  fillRecruitmentKeywords(keywords) {
    cy.get('input[placeholder="Enter comma seperated words..."]').type(
      keywords,
      { delay: 0 },
    );
  }

  fillRecruitmentDateFrom(date) {
    cy.get('input[placeholder="From"]').type(date, { delay: 0 });
  }

  fillRecruitmentDateTo(date) {
    cy.get('input[placeholder="To"]').type(date, { delay: 0 });
    cy.get("body").click(0, 0);
  }

  selectRecruitmentMethodOfApplication(method) {
    cy.contains("label", "Method of Application")
      .parent()
      .find(".oxd-select-text")
      .click();
    cy.contains(".oxd-select-option", method).click();
  }

  clickRecruitmentSearch() {
    cy.contains("button", "Search").click();
  }

  clickRecruitmentReset() {
    cy.contains("button", "Reset").click();
  }

  clickRecruitmentAddButton() {
    cy.contains("button", "Add").click();
  }

  // Row action icons: eye (view) is the first icon button, trash (delete)
  // is the second, in each candidate row's Actions column.
  clickRecruitmentViewButton() {
    cy.get(".oxd-table-card")
      .first()
      .find("button, .oxd-icon-button")
      .eq(0)
      .click();
  }

  clickRecruitmentDeleteButton() {
    cy.get(".oxd-table-card")
      .first()
      .find("button, .oxd-icon-button")
      .eq(1)
      .click();
  }

  confirmRecruitmentDelete() {
    cy.contains("button", "Yes, Delete").click();
  }

  // Add Candidate form
  fillAddCandidateFirstName(firstName) {
    cy.get('input[placeholder="First Name"]').type(firstName, { delay: 0 });
  }

  fillAddCandidateLastName(lastName) {
    cy.get('input[placeholder="Last Name"]').type(lastName, { delay: 0 });
  }

  fillAddCandidateEmail(email) {
    cy.get('input[placeholder="Type here"]').eq(0).type(email, { delay: 0 });
  }

  clickAddCandidateSave() {
    cy.contains("button", "Save").click();
  }

  clickAddCandidateCancel() {
    cy.contains("button", "Cancel").click();
  }

  // =========================================================
  // ASSERTION - Recruitment
  // =========================================================
  verifyRecruitmentPageIsDisplayed() {
    cy.contains("h5", "Candidates").should("be.visible");
    cy.contains("button", "Search").should("be.visible");
  }

  verifyCandidateFoundWithJobTitle(jobTitle) {
    cy.get(".oxd-table-card").should("contain.text", jobTitle);
  }

  verifyCandidateFoundWithVacancy(vacancy) {
    cy.get(".oxd-table-card").should("contain.text", vacancy);
  }

  verifyCandidateFoundWithHiringManager(manager) {
    cy.get(".oxd-table-card").should("contain.text", manager);
  }

  verifyCandidateFoundWithStatus(status) {
    cy.get(".oxd-table-card").should("contain.text", status);
  }

  verifyCandidateFoundWithName(name) {
    cy.get(".oxd-table-card").should("contain.text", name);
  }

  verifyCandidateFoundWithKeyword() {
    cy.get(".oxd-table-card").should("exist");
  }

  verifyNoRecordsFoundRecruitment() {
    cy.contains("No Records Found").should("be.visible");
  }

  verifyDateRangeErrorMessage() {
    cy.contains("From date should be before to date").should("be.visible");
    cy.contains("To date should be after from date").should("be.visible");
  }

  verifySearchFieldsAreReset() {
    cy.get('input[placeholder="Type for hints..."]').should("have.value", "");
    cy.get('input[placeholder="Enter comma seperated words..."]').should(
      "have.value",
      "",
    );
  }

  verifyRedirectedToAddCandidatePage() {
    cy.url({ timeout: 15000 }).should("include", "/recruitment/addCandidate");
    cy.contains("h5", "Add Candidate", { timeout: 15000 }).should("be.visible");
    cy.get('input[placeholder="First Name"]').should("be.visible");
    cy.get('input[placeholder="Last Name"]').should("be.visible");
  }

  verifyRedirectedToCandidateDetailPage() {
    cy.contains("Application Stage").should("be.visible");
    cy.contains("Candidate Profile").should("be.visible");
  }

  verifyCandidateIsDeleted() {
    cy.contains("Success").should("be.visible");
  }

  // =========================================================
  // INTERCEPT - RECRUITMENT (8 test cases -> 8 distinct intercepts)
  // =========================================================
  interceptRecruitmentSearchByJobTitle() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates*").as(
      "recruitmentSearchByJobTitle",
    );
  }
  waitRecruitmentSearchByJobTitle() {
    cy.wait("@recruitmentSearchByJobTitle")
      .its("response.statusCode")
      .should("eq", 200);
  }

  interceptRecruitmentSearchByVacancy() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates*").as(
      "recruitmentSearchByVacancy",
    );
  }
  waitRecruitmentSearchByVacancy() {
    cy.wait("@recruitmentSearchByVacancy")
      .its("response.statusCode")
      .should("eq", 200);
  }

  interceptRecruitmentSearchByHiringManager() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates*").as(
      "recruitmentSearchByHiringManager",
    );
  }
  waitRecruitmentSearchByHiringManager() {
    cy.wait("@recruitmentSearchByHiringManager")
      .its("response.statusCode")
      .should("eq", 200);
  }

  interceptRecruitmentSearchByStatus() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates*").as(
      "recruitmentSearchByStatus",
    );
  }
  waitRecruitmentSearchByStatus() {
    cy.wait("@recruitmentSearchByStatus")
      .its("response.statusCode")
      .should("eq", 200);
  }

  interceptRecruitmentSearchByCandidateName() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates*").as(
      "recruitmentSearchByCandidateName",
    );
  }
  waitRecruitmentSearchByCandidateName() {
    cy.wait("@recruitmentSearchByCandidateName")
      .its("response.statusCode")
      .should("eq", 200);
  }

  interceptRecruitmentSearchByKeywords() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates*").as(
      "recruitmentSearchByKeywords",
    );
  }
  waitRecruitmentSearchByKeywords() {
    cy.wait("@recruitmentSearchByKeywords")
      .its("response.statusCode")
      .should("eq", 200);
  }

  interceptRecruitmentSearchByDateRange() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates*").as(
      "recruitmentSearchByDateRange",
    );
  }
  waitRecruitmentSearchByDateRange() {
    cy.wait("@recruitmentSearchByDateRange")
      .its("response.statusCode")
      .should("eq", 200);
  }

  interceptRecruitmentSearchByMethodOfApplication() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates*").as(
      "recruitmentSearchByMethodOfApplication",
    );
  }
  waitRecruitmentSearchByMethodOfApplication() {
    cy.wait("@recruitmentSearchByMethodOfApplication")
      .its("response.statusCode")
      .should("eq", 200);
  }

  // ---- Additional intercepts for Add/View/Delete workflow (TC_RT_010-016) ----
  interceptRecruitmentSearchInvalidName() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates*").as(
      "recruitmentSearchInvalidName",
    );
  }
  waitRecruitmentSearchInvalidName() {
    cy.wait("@recruitmentSearchInvalidName")
      .its("response.statusCode")
      .should("eq", 200);
  }

  interceptRecruitmentSearchIncompleteKeyword() {
    cy.intercept("GET", "**/api/v2/recruitment/candidates*").as(
      "recruitmentSearchIncompleteKeyword",
    );
  }
  waitRecruitmentSearchIncompleteKeyword() {
    cy.wait("@recruitmentSearchIncompleteKeyword")
      .its("response.statusCode")
      .should("eq", 200);
  }

  interceptRecruitmentDeleteCandidate() {
    cy.intercept("DELETE", "**/api/v2/recruitment/candidates*").as(
      "deleteCandidate",
    );
  }
  waitRecruitmentDeleteCandidate() {
    cy.wait("@deleteCandidate").its("response.statusCode").should("eq", 200);
  }
}

export default new ProjectPage();
