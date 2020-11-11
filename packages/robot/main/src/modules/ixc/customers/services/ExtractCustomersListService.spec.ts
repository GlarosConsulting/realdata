import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import ixcConfig from '@config/ixc';

import AuthenticateUserService from '@modules/ixc/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/ixc/login/services/NavigateToLogInPageService';

import ExtractCustomersListService from './ExtractCustomersListService';
import NavigateToCustomersPageService from './NavigateToCustomersPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToCustomersPage: NavigateToCustomersPageService;
let extractCustomersList: ExtractCustomersListService;

let browser: Browser;
let page: Page;

describe('FindCustomerByField', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    navigateToLogInPage = new NavigateToLogInPageService(page);
    authenticateUser = new AuthenticateUserService(page);
    navigateToCustomersPage = new NavigateToCustomersPageService(page);
    extractCustomersList = new ExtractCustomersListService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to navigate to customers page', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = ixcConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToCustomersPage.execute();

    const customers = await extractCustomersList.execute();

    console.log(customers);

    expect(customers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          active: expect.any(Boolean),
          id: expect.any(String),
          company_name: expect.any(String),
          fantasy_name: expect.any(String),
          document: expect.any(String),
          identity: expect.any(String),
        }),
      ]),
    );
  });
});
