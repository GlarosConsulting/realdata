import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';

import AuthenticateUserService from './AuthenticateUserService';
import NavigateToLogInPageService from './NavigateToLogInPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;

let browser: Browser;
let page: Page;

describe('AuthenticateUser', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    navigateToLogInPage = new NavigateToLogInPageService(page);
    authenticateUser = new AuthenticateUserService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to authenticate user', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    const [findFilialElement] = await page.findElementsBySelector(
      '#dashboardStatementsCard > div.col-xs-6.ca-u-z-index--300.ca-u-no-padding-left > statement-card > div > div.dashboard-small-card-height.slimbox.ng-isolate-scope.is-raisable.ca-u-z-index--200 > div.slimbox-header.ng-scope > h3',
    );

    expect(findFilialElement).toBeTruthy();
  });
});
