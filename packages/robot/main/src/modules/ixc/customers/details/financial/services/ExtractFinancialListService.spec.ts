import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import ixcConfig from '@config/ixc';
import testingCustomersConfig from '@config/testing_customers';

import OpenCustomerDetailsService from '@modules/ixc/customers/details/main/services/OpenCustomerDetailsService';
import FindCustomerByFieldService from '@modules/ixc/customers/main/services/FindCustomerByFieldService';
import NavigateToCustomersPageService from '@modules/ixc/customers/main/services/NavigateToCustomersPageService';
import AuthenticateUserService from '@modules/ixc/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/ixc/login/services/NavigateToLogInPageService';

import ExtractFinancialListService from './ExtractFinancialListService';
import NavigateToFinancialTabService from './NavigateToFinancialTabService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToCustomersPage: NavigateToCustomersPageService;
let findCustomerByField: FindCustomerByFieldService;
let openCustomerDetails: OpenCustomerDetailsService;
let navigateToFinancialTab: NavigateToFinancialTabService;
let extractFinancialList: ExtractFinancialListService;

let browser: Browser;
let page: Page;

describe('ExtractFinancialList', () => {
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
    openCustomerDetails = new OpenCustomerDetailsService(page);
    navigateToFinancialTab = new NavigateToFinancialTabService(page);
    extractFinancialList = new ExtractFinancialListService(page);
  });

  afterAll(async () => {
    // await browser.close();
  });

  it('should be able to extract financial list', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = ixcConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToCustomersPage.execute();

    const testingCustomerData = testingCustomersConfig[0];

    const customer = await findCustomerByField.execute({
      field: 'id',
      value: testingCustomerData.ixc.id,
    });

    await openCustomerDetails.execute({ customer_id: customer.id });

    await navigateToFinancialTab.execute();

    const financial = await extractFinancialList.execute();

    expect(financial).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          status: expect.any(String),
          charge: expect.any(Number),
          contract_r: expect.any(String),
          installment_r: expect.any(Number),
          contract_a: expect.any(String),
          sell_id: expect.any(String),
          emission_date: expect.any(Date),
          due_date: expect.any(Date),
          value: expect.any(Number),
          received_value: expect.any(Number),
          open_value: expect.any(Number),
          paid_value: expect.any(Number),
          type: expect.any(String),
          cancellation_reason: expect.any(String),
        }),
      ]),
    );
  });
});
