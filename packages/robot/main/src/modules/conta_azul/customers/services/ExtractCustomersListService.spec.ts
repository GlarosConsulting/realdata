import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';

import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import ExtractCustomersListService from './ExtractCustomersListService';
import NavigateToCustomersPageService from './NavigateToCustomersPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToCustomersPage: NavigateToCustomersPageService;
let extractCustomersList: ExtractCustomersListService;

let browser: Browser;
let page: Page;

describe('ExtractCustomersList', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch({ headless: false });
  });

  beforeEach(async () => {
    page = await browser.newPage();

    navigateToLogInPage = new NavigateToLogInPageService(page);
    authenticateUser = new AuthenticateUserService(page);
    navigateToCustomersPage = new NavigateToCustomersPageService(page);
    extractCustomersList = new ExtractCustomersListService(page);
  });

  afterAll(async () => {
    // await browser.close();
  });

  it('should be able to extract customers list', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToCustomersPage.execute();

    const customers = await extractCustomersList.execute();

    expect(customers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          document: expect.any(String),
          email: expect.any(String),
          phone: expect.any(String),
          active: expect.any(Boolean),
        }),
      ]),
    );
  });
});
