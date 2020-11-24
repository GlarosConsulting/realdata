import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';

import NavigateToCustomersPageService from '@modules/conta_azul/customers/main/services/NavigateToCustomersPageService';
import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import NavigateToCreateCustomerPageService from './NavigateToCreateCustomerPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToCustomersPage: NavigateToCustomersPageService;
let navigateToCreateCustomerPage: NavigateToCreateCustomerPageService;

let browser: Browser;
let page: Page;

describe('NavigateToCreateCustomerPage', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    navigateToLogInPage = new NavigateToLogInPageService(page);
    authenticateUser = new AuthenticateUserService(page);
    navigateToCustomersPage = new NavigateToCustomersPageService(page);
    navigateToCreateCustomerPage = new NavigateToCreateCustomerPageService(
      page,
    );
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to navigate to customers page', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    const goTo = jest.spyOn(page, 'goTo');

    await navigateToCustomersPage.execute();

    await navigateToCreateCustomerPage.execute();

    expect(goTo).toHaveBeenCalled();
  });
});
