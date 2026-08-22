import projectPage from "../support/projectPage";

describe("Project Akhir", () => {
  let data;

  before(() => {
    cy.fixture("projectData").then((fixtureData) => {
      data = fixtureData;
    });
  });

  // =========================================================================
  // LOGIN
  // =========================================================================
  describe("Login", () => {
    beforeEach(() => {
      projectPage.visitLoginPage();
    });

    it("TC_LG_001 - Verifikasi tampilan halaman login", () => {
      projectPage.verifyLoginPageIsDisplayed();
    });

    it("TC_LG_002 - Verifikasi login dengan username dan password yang valid", () => {
      projectPage.login(data.validUsername, data.validPassword);
      projectPage.verifyLoginSuccess();
    });

    it("TC_LG_003 - Verifikasi login dengan username yang valid dan password yang invalid", () => {
      projectPage.login(data.validUsername, data.invalidPassword);
      projectPage.verifyLoginFailed();
    });

    it("TC_LG_004 - Verifikasi login dengan username yang invalid dan password yang valid", () => {
      projectPage.interceptLoginInvalidUsername();
      projectPage.login(data.invalidUsername, data.validPassword);
      projectPage.waitLoginInvalidUsername();
      projectPage.verifyLoginFailed();
    });

    it("TC_LG_005 - Verifikasi login dengan username invalid dan password invalid", () => {
      projectPage.interceptLoginInvalidBoth();
      projectPage.login(data.invalidUsername, data.invalidPassword);
      projectPage.waitLoginInvalidBoth();
      projectPage.verifyLoginFailed();
    });

    it("TC_LG_006 - Verifikasi login dengan username kosong dan password kosong", () => {
      projectPage.interceptLoginEmptyBoth();
      projectPage.clickLoginButton();
      projectPage.verifyRequiredFieldMessage();
    });

    it("TC_LG_007 - Verifikasi login dengan username valid dan password kosong", () => {
      projectPage.interceptLoginValidUserEmptyPass();
      projectPage.fillUsername(data.validUsername);
      projectPage.clickLoginButton();
      projectPage.verifyRequiredFieldMessage();
    });

    it("TC_LG_008 - Verifikasi login dengan username kosong dan password valid", () => {
      projectPage.interceptLoginEmptyUserValidPass();
      projectPage.fillPassword(data.validPassword);
      projectPage.clickLoginButton();
      projectPage.verifyRequiredFieldMessage();
    });

    it("TC_LG_009 - Verifikasi Halaman forgot password", () => {
      projectPage.interceptForgotPassword();
      projectPage.clickForgotPasswordLink();
      projectPage.waitForgotPassword();
      projectPage.verifyForgotPasswordPage();
    });
  });

  // =========================================================================
  // DIRECTORY
  // =========================================================================
  describe("Directory", () => {
    beforeEach(() => {
      cy.viewport(1440, 900); // pastikan panel detail (kolom kanan) tidak collapse
      projectPage.visitLoginPage();
      projectPage.login(data.validUsername, data.validPassword);
      cy.url({ timeout: 20000 }).should("include", "/dashboard/index");
      cy.contains("Dashboard", { timeout: 20000 }).should("be.visible");
      projectPage.visitDirectoryPage();
    });

    it("TC_DY_001 - Verifikasi tampilan halaman Directory", () => {
      projectPage.verifyDirectoryPageIsDisplayed();
    });

    it("TC_DY_002 - Mencoba melakukan pencarian berdasarkan employee name yang terdaftar", () => {
      projectPage.interceptDirectorySearchByEmployeeName();
      projectPage.fillDirectoryEmployeeName(data.directoryValidEmployeeName);
      projectPage.clickDirectorySearch();
      projectPage.waitDirectorySearchByEmployeeName();
      projectPage.verifyEmployeeFoundInDirectory(
        data.directoryValidEmployeeName,
      );
    });

    it("TC_DY_003 - Mencoba melakukan pencarian berdasarkan job title yang terdaftar", () => {
      projectPage.interceptDirectorySearchByJobTitle();
      projectPage.selectDirectoryJobTitleDynamic().then((selectedJobTitle) => {
        projectPage.clickDirectorySearch();
        projectPage.waitDirectorySearchByJobTitle();
        projectPage.verifyEmployeeFoundInDirectory(selectedJobTitle);
      });
    });

    it("TC_DY_004 - Mencoba melakukan pencarian berdasarkan location yang terdaftar", () => {
      projectPage.interceptDirectorySearchByLocation();
      projectPage.selectDirectoryLocation(data.directoryValidLocation);
      projectPage.clickDirectorySearch();
      projectPage.waitDirectorySearchByLocation();
      projectPage.verifyEmployeeFoundInDirectory(data.directoryValidLocation);
    });

     it("TC_DY_005 - Mencoba melihat panel detail untuk karyawan tanpa foto", () => {
      projectPage.clickAnyEmployeeCard();
      projectPage.verifyEmployeeDetailIsDisplayed();
 
      cy.get("img", { timeout: 15000 }).should("be.visible");
    });
 
    it("TC_DY_006 - Mencoba melakukan pencarian berdasarkan job title dengan hasil kosong", () => {
      projectPage.interceptDirectorySearchByInvalidJobTitle();
      cy.get(".oxd-select-text").eq(0).click();
      cy.get(".oxd-select-option").last().click();
      projectPage.clickDirectorySearch();
      projectPage.waitDirectorySearchByInvalidJobTitle();
      cy.get("body").should("be.visible");
    });
 
    it("TC_DY_007 - Mencoba melakukan pencarian berdasarkan location yang tidak terdaftar", () => {
      projectPage.interceptDirectorySearchByInvalidLocation();
      projectPage.selectDirectoryLocation(data.directoryInvalidLocation);
      projectPage.clickDirectorySearch();
      projectPage.waitDirectorySearchByInvalidLocation();
      projectPage.verifyNoRecordsFound();
    });
 
    it("TC_DY_008 - Mencoba melihat panel detail untuk karyawan tanpa Job Title/Location", () => {
      projectPage.clickAnyEmployeeCard();
      projectPage.verifyEmployeeDetailIsDisplayed();
 
      cy.get("body")
        .should("not.contain", "undefined")
        .and("not.contain", "null");
    });
 
    it("TC_DY_009 - Mencoba melakukan pencarian dengan kombinasi filter (Name + Location)", () => {
      projectPage.fillDirectoryEmployeeName(data.directoryValidEmployeeName);
      projectPage.selectDirectoryLocation(data.directoryValidLocation);
      projectPage.clickDirectorySearch();
      cy.wait(1000);
      projectPage.verifyEmployeeFoundInDirectory(
        data.directoryValidEmployeeName,
      );
    });
 
    it("TC_DY_010 - Verifikasi data pada panel detail sesuai dengan card yang diklik", () => {
      const employeeName = data.directoryValidEmployeeName;
 
      projectPage.clickEmployeeCardByName(employeeName);
      projectPage.verifyEmployeeDetailIsDisplayed();
 
      cy.contains(employeeName, { timeout: 15000 }).should("be.visible");
    });
  });

  // =========================================================================
  // RECRUITMENT
  // =========================================================================
  describe("Recruitment", () => {
    beforeEach(() => {
      projectPage.visitLoginPage();
      projectPage.login(data.validUsername, data.validPassword);
      cy.url({ timeout: 20000 }).should("include", "/dashboard/index");
      projectPage.visitRecruitmentPage();
    });

    it("TC_RT_001 - Verifikasi tampilan halaman Recuirement", () => {
      projectPage.verifyRecruitmentPageIsDisplayed();
    });

    it("TC_RT_002 - Melakukan search candidat dengan menggunakan job title yang terdaftar", () => {
      projectPage.interceptRecruitmentSearchByJobTitle();
      projectPage.selectRecruitmentJobTitle(data.recruitmentValidJobTitle);
      projectPage.clickRecruitmentSearch();
      projectPage.waitRecruitmentSearchByJobTitle();
      projectPage.verifyCandidateFoundWithJobTitle(
        data.recruitmentValidJobTitle,
      );
    });

    it("TC_RT_003 - Melakukan search candidat dengan menggunakan Vacancy yang terdaftar", () => {
      projectPage.interceptRecruitmentSearchByVacancy();
      projectPage.selectRecruitmentVacancy(data.recruitmentValidVacancy);
      projectPage.clickRecruitmentSearch();
      projectPage.waitRecruitmentSearchByVacancy();
      projectPage.verifyCandidateFoundWithVacancy(data.recruitmentValidVacancy);
    });

    it("TC_RT_004 - Melakukan search candidat dengan menggunakan Hiring Manager yang terdaftar", () => {
      projectPage.interceptRecruitmentSearchByHiringManager();
      projectPage.selectRecruitmentHiringManager(
        data.recruitmentValidHiringManager,
      );
      projectPage.clickRecruitmentSearch();
      projectPage.waitRecruitmentSearchByHiringManager();
      projectPage.verifyCandidateFoundWithHiringManager(
        data.recruitmentValidHiringManager,
      );
    });

    it("TC_RT_005 - Melakukan search candidat dengan menggunakan Status yang terdaftar", () => {
      projectPage.interceptRecruitmentSearchByStatus();
      projectPage.selectRecruitmentStatus(data.recruitmentValidStatus);
      projectPage.clickRecruitmentSearch();
      projectPage.waitRecruitmentSearchByStatus();
      projectPage.verifyCandidateFoundWithStatus(data.recruitmentValidStatus);
    });

    it("TC_RT_006 - Melakukan search candidat dengan menggunakan Candidate Name yang terdaftar", () => {
      projectPage.interceptRecruitmentSearchByCandidateName();
      projectPage.fillRecruitmentCandidateName(
        data.recruitmentValidCandidateName,
      );
      projectPage.clickRecruitmentSearch();
      projectPage.waitRecruitmentSearchByCandidateName();
      projectPage.verifyCandidateFoundWithName(
        data.recruitmentValidCandidateName,
      );
    });

    it("TC_RT_007 - Melakukan search candidat dengan menggunakan Keywords yang terdaftar", () => {
      projectPage.interceptRecruitmentSearchByKeywords();
      projectPage.fillRecruitmentKeywords(data.recruitmentValidKeywords);
      projectPage.clickRecruitmentSearch();
      projectPage.waitRecruitmentSearchByKeywords();
      projectPage.verifyCandidateFoundWithKeyword();
    });

    it("TC_RT_008 - Melakukan search candidat dengan menggunakan Date application yang benar", () => {
      projectPage.interceptRecruitmentSearchByDateRange();
      projectPage.fillRecruitmentDateFrom(data.recruitmentDateFromValid);
      projectPage.fillRecruitmentDateTo(data.recruitmentDateToValid);
      projectPage.clickRecruitmentSearch();
      projectPage.waitRecruitmentSearchByDateRange();
      projectPage.verifyCandidateFoundWithKeyword();
    });

    it("TC_RT_009 - Melakukan search candidat dengan menggunakan Method of Application", () => {
      projectPage.interceptRecruitmentSearchByMethodOfApplication();
      projectPage.selectRecruitmentMethodOfApplication(
        data.recruitmentMethodOfApplication,
      );
      projectPage.clickRecruitmentSearch();
      projectPage.waitRecruitmentSearchByMethodOfApplication();
      projectPage.verifyCandidateFoundWithKeyword();
    });

    it("TC_RT_010 - Melakukan search candidat dengan menggunakan Candidate Name yang tidak terdaftar", () => {
      projectPage.interceptRecruitmentSearchInvalidName();
      projectPage.fillRecruitmentCandidateName(
        data.recruitmentInvalidCandidateName,
      );
      projectPage.clickRecruitmentSearch();
      projectPage.waitRecruitmentSearchInvalidName();
      projectPage.verifyNoRecordsFoundRecruitment();
    });

    it("TC_RT_011 - Melakukan search candidat dengan menggunakan Keywords yang tidak lengkap", () => {
      projectPage.interceptRecruitmentSearchIncompleteKeyword();
      projectPage.fillRecruitmentKeywords(data.recruitmentIncompleteKeywords);
      projectPage.clickRecruitmentSearch();
      projectPage.waitRecruitmentSearchIncompleteKeyword();
      projectPage.verifyNoRecordsFoundRecruitment();
    });

    it("TC_RT_012 - Melakukan search candidat dengan menggunakan Date application yang salah", () => {
      projectPage.fillRecruitmentDateFrom(data.recruitmentDateFromInvalid);
      projectPage.fillRecruitmentDateTo(data.recruitmentDateToInvalid);
      projectPage.clickRecruitmentSearch();
      projectPage.verifyDateRangeErrorMessage();
    });

    it("TC_RT_013 - varifikasi tombol reset", () => {
      // Isi salah satu kolom filter, klik Reset, pastikan kolom kembali kosong
      projectPage.fillRecruitmentCandidateName(
        data.recruitmentValidCandidateName,
      );
      projectPage.fillRecruitmentKeywords(data.recruitmentValidKeywords);
      projectPage.clickRecruitmentReset();
      projectPage.verifySearchFieldsAreReset();
    });

    it("TC_RT_014 - varifikasi tombol ADD", () => {
      projectPage.clickRecruitmentAddButton();
      projectPage.verifyRedirectedToAddCandidatePage();
    });

    it("TC_RT_015 - varifikasi tombol Mata", () => {
      projectPage.clickRecruitmentViewButton();
      projectPage.verifyRedirectedToCandidateDetailPage();
    });

    it("TC_RT_016 - varifikasi tombol Delete", () => {
      projectPage.interceptRecruitmentDeleteCandidate();
      projectPage.clickRecruitmentDeleteButton();
      projectPage.confirmRecruitmentDelete();
      projectPage.waitRecruitmentDeleteCandidate();
      projectPage.verifyCandidateIsDeleted();
    });
  });
});
