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
      projectPage.interceptLoginValidCredentials();
      projectPage.login(data.validUsername, data.validPassword);
      projectPage.waitLoginValidCredentials();
      projectPage.verifyLoginSuccess();
    });

    it("TC_LG_003 - Verifikasi login dengan username yang valid dan password yang invalid", () => {
      projectPage.interceptLoginInvalidPassword();
      projectPage.login(data.validUsername, data.invalidPassword);
      projectPage.waitLoginInvalidPassword();
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
      projectPage.visitLoginPage();
      projectPage.login(data.validUsername, data.validPassword);
      cy.url({ timeout: 20000 }).should("include", "/dashboard/index");
      projectPage.visitDirectoryPage();
    });

    it("TC_DY_001 - Verifikasi tampilan halaman Directory", () => {
      projectPage.interceptDirectoryPageDisplay();
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
      projectPage.selectDirectoryJobTitle(data.directoryValidJobTitle);
      projectPage.clickDirectorySearch();
      projectPage.waitDirectorySearchByJobTitle();
      projectPage.verifyEmployeeFoundInDirectory(data.directoryValidJobTitle);
    });

    it("TC_DY_004 - Mencoba melakukan pencarian berdasarkan location yang terdaftar", () => {
      projectPage.interceptDirectorySearchByLocation();
      projectPage.selectDirectoryLocation(data.directoryValidLocation);
      projectPage.clickDirectorySearch();
      projectPage.waitDirectorySearchByLocation();
      projectPage.verifyEmployeeFoundInDirectory(data.directoryValidLocation);
    });

    it("TC_DY_005 - Mencoba melakukan pencarian berdasarkan employee name yang tidak terdaftar", () => {
      projectPage.interceptDirectorySearchByInvalidEmployeeName();
      projectPage.fillDirectoryEmployeeName(data.directoryInvalidEmployeeName);
      projectPage.clickDirectorySearch();
      projectPage.waitDirectorySearchByInvalidEmployeeName();
      projectPage.verifyNoRecordsFound();
    });

    it("TC_DY_006 - Mencoba melakukan pencarian berdasarkan job title yang tidak terdaftar", () => {
      projectPage.interceptDirectorySearchByInvalidJobTitle();
      projectPage.selectDirectoryJobTitle(data.directoryInvalidJobTitle);
      projectPage.clickDirectorySearch();
      projectPage.waitDirectorySearchByInvalidJobTitle();
      projectPage.verifyNoRecordsFound();
    });

    it("TC_DY_007 - Mencoba melakukan pencarian berdasarkan location yang tidak terdaftar", () => {
      projectPage.interceptDirectorySearchByInvalidLocation();
      projectPage.selectDirectoryLocation(data.directoryInvalidLocation);
      projectPage.clickDirectorySearch();
      projectPage.waitDirectorySearchByInvalidLocation();
      projectPage.verifyNoRecordsFound();
    });

    it("TC_DY_008 - Mencoba melihat informasi tentang employee", () => {
      projectPage.interceptDirectoryViewEmployeeDetail();
      projectPage.clickFirstEmployeeCard();
      projectPage.waitDirectoryViewEmployeeDetail();
      projectPage.verifyEmployeeDetailIsDisplayed();
    });

    it("TC_DY_009 - Mencoba melakukan scan QR pada informasi employee", () => {
      // Cypress tidak bisa benar-benar "scan" QR pakai kamera fisik.
      // Yang bisa diverifikasi secara otomatis adalah QR code-nya
      // ter-render dengan benar di panel detail employee.
      projectPage.clickFirstEmployeeCard();
      projectPage.verifyEmployeeDetailIsDisplayed();
      projectPage.verifyEmployeeQrCodeIsDisplayed();
    });

    it("TC_DY_010 - Mencoba menekan tombol email pada informasi employee", () => {
      // Cypress tidak membuka tab baru/Gmail sungguhan; validasi yang
      // reliable adalah memastikan link mailto: mengarah ke alamat yang benar.
      projectPage.clickFirstEmployeeCard();
      projectPage.verifyEmployeeDetailIsDisplayed();
      projectPage.verifyEmployeeEmailLinkOpensCorrectly("@");
    });

    it("TC_DY_011 - Mencoba menekan tombol telpon pada informasi employee", () => {
      projectPage.clickFirstEmployeeCard();
      projectPage.verifyEmployeeDetailIsDisplayed();
      projectPage.verifyEmployeePhoneLinkIsCorrect();
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
