import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import ixcConfig from '@config/ixc';

import FindCustomerByFieldService from '@modules/ixc/customers/main/services/FindCustomerByFieldService';
import NavigateToCustomersPageService from '@modules/ixc/customers/main/services/NavigateToCustomersPageService';
import AuthenticateUserService from '@modules/ixc/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/ixc/login/services/NavigateToLogInPageService';

import OpenCustomerDetailsService from './OpenCustomerDetailsService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToCustomersPage: NavigateToCustomersPageService;
let findCustomerByField: FindCustomerByFieldService;
let openCustomerDetails: OpenCustomerDetailsService;

let browser: Browser;
let page: Page;

describe('OpenCustomerDetails', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    navigateToLogInPage = new NavigateToLogInPageService(page);
    authenticateUser = new AuthenticateUserService(page);
    navigateToCustomersPage = new NavigateToCustomersPageService(page);
    findCustomerByField = new FindCustomerByFieldService(page);
    openCustomerDetails = new OpenCustomerDetailsService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to open customer details', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = ixcConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToCustomersPage.execute();

    const testingCustomerData = ixcConfig.testing.customers[0];

    const customer = await findCustomerByField.execute({
      field: 'id',
      value: testingCustomerData.id,
    });

    await openCustomerDetails.execute({ customer });

    const [findIdInputElement] = await page.findElementsBySelector(
      'div.panel.mostrando input#id[name="id"]',
    );

    expect(findIdInputElement).toBeTruthy();
  });
});
