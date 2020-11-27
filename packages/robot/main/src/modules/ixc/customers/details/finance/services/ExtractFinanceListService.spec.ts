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

import ExtractFinanceListService from './ExtractFinanceListService';
import NavigateToFinanceTabService from './NavigateToFinanceTabService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToCustomersPage: NavigateToCustomersPageService;
let findCustomerByField: FindCustomerByFieldService;
let openCustomerDetails: OpenCustomerDetailsService;
let navigateToFinanceTab: NavigateToFinanceTabService;
let extractFinanceList: ExtractFinanceListService;

let browser: Browser;
let page: Page;

describe('ExtractFinanceList', () => {
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
    navigateToFinanceTab = new NavigateToFinanceTabService(page);
    extractFinanceList = new ExtractFinanceListService(page);
  });

  afterAll(async () => {
    // await browser.close();
  });

  it('should be able to extract finance list', async () => {
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

    await navigateToFinanceTab.execute();

    const finances = await extractFinanceList.execute();

    expect(finances).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          status: expect.any(String),
          charge: expect.any(Number),
          contract_r: expect.any(Number),
          installment_r: expect.any(Number),
          contract_a: expect.any(Number),
          sell_id: expect.any(String),
          emission_date: expect.any(Date),
          due_date: expect.any(Date),
          value: expect.any(Number),
          received_value: expect.any(Number),
          open_value: expect.any(Number),
          paid_value: expect.any(Number),
          type: expect.any(String),
        }),
      ]),
    );
  });
});
