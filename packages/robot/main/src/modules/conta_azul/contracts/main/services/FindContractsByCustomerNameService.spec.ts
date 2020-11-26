import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';
import testingCustomersConfig from '@config/testing_customers';

import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import FindContractsByCustomerNameService from './FindContractsByCustomerNameService';
import NavigateToContractsPageService from './NavigateToContractsPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToContractsPage: NavigateToContractsPageService;
let findContractsByCustomerName: FindContractsByCustomerNameService;

let browser: Browser;
let page: Page;

describe('FindContractsByCustomerName', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch({ headless: false });
  });

  beforeEach(async () => {
    page = await browser.newPage();

    navigateToLogInPage = new NavigateToLogInPageService(page);
    authenticateUser = new AuthenticateUserService(page);
    navigateToContractsPage = new NavigateToContractsPageService(page);
    findContractsByCustomerName = new FindContractsByCustomerNameService(page);
  });

  afterAll(async () => {
    // await browser.close();
  });

  it('should be able to find contracts by customer name', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToContractsPage.execute();

    const testingCustomer = testingCustomersConfig[0];

    const contracts = await findContractsByCustomerName.execute({
      name: testingCustomer.name,
    });

    expect(contracts).toEqual(
      expect.arrayContaining([
        {
          customer_name: testingCustomer.name,
          active: expect.any(Boolean),
          next_billing_date: expect.any(Date),
          remaining_validity: expect.any(String),
          monthly_value:
            testingCustomer.ixc.details.contracts[0].products.net_value,
        },
      ]),
    );
  });
});
