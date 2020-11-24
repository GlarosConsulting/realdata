import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';
import testingCustomersConfig from '@config/testing_customers';

import NavigateToCustomersPageService from '@modules/conta_azul/customers/main/services/NavigateToCustomersPageService';
import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import FillCreateCustomerDataService from './FillCreateCustomerDataService';
import NavigateToCreateCustomerPageService from './NavigateToCreateCustomerPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToCustomersPage: NavigateToCustomersPageService;
let navigateToCreateCustomerPage: NavigateToCreateCustomerPageService;
let fillCreateCustomerData: FillCreateCustomerDataService;

let browser: Browser;
let page: Page;

describe('FillCreateCustomerData', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch({ headless: false });
  });

  beforeEach(async () => {
    page = await browser.newPage();

    navigateToLogInPage = new NavigateToLogInPageService(page);
    authenticateUser = new AuthenticateUserService(page);
    navigateToCustomersPage = new NavigateToCustomersPageService(page);
    navigateToCreateCustomerPage = new NavigateToCreateCustomerPageService(
      page,
    );
    fillCreateCustomerData = new FillCreateCustomerDataService(page);
  });

  afterAll(async () => {
    // await browser.close();
  });

  it('should be able to navigate to customers page', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToCustomersPage.execute();

    await navigateToCreateCustomerPage.execute();

    const testingCustomer = testingCustomersConfig[1];

    await fillCreateCustomerData.execute({
      person_type: 'fisica',
      document: testingCustomer.document,
      name: testingCustomer.name,
      ixc_id: testingCustomer.ixc.id,
      additional_info: {
        email: testingCustomer.ixc.details.contact.email,
        phone_commercial: testingCustomer.ixc.details.contact.phone_commercial,
        phone_mobile: testingCustomer.ixc.details.contact.phone_mobile,
        birth_date: testingCustomer.ixc.details.main.birth_date,
        rg: testingCustomer.ixc.identity,
      },
      address: {
        cep: testingCustomer.ixc.details.address.cep,
        number: testingCustomer.ixc.details.address.number,
        complement: testingCustomer.ixc.details.address.complement,
      },
    });
  });
});
