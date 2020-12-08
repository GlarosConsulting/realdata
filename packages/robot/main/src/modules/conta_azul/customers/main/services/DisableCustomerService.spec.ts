import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';
import testingCustomersConfig from '@config/testing_customers';

import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import DisableCustomerService from './DisableCustomerService';
import FindCustomerByFieldService from './FindCustomerByFieldService';
import NavigateToCustomersPageService from './NavigateToCustomersPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToCustomersPage: NavigateToCustomersPageService;
let findCustomerByField: FindCustomerByFieldService;
let disableCustomer: DisableCustomerService;

let browser: Browser;
let page: Page;

describe('DisableCustomer', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch({ headless: false });
  });

  beforeEach(async () => {
    page = await browser.newPage();

    navigateToLogInPage = new NavigateToLogInPageService(page);
    authenticateUser = new AuthenticateUserService(page);
    navigateToCustomersPage = new NavigateToCustomersPageService(page);
    findCustomerByField = new FindCustomerByFieldService(page);
    disableCustomer = new DisableCustomerService(page);
  });

  afterAll(async () => {
    // await browser.close();
  });

  it('should be able to find customer by field', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToCustomersPage.execute();

    const testingCustomer = testingCustomersConfig[0];

    const customer = await findCustomerByField.execute({
      field: 'document',
      value: testingCustomer.document,
    });

    await disableCustomer.execute({ customer_name: customer.name });
  });
});
