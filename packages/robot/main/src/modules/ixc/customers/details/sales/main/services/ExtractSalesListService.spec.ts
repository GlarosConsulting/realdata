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

import ExtractSalesListService from './ExtractSalesListService';
import NavigateToSalesTabService from './NavigateToSalesTabService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToCustomersPage: NavigateToCustomersPageService;
let findCustomerByField: FindCustomerByFieldService;
let openCustomerDetails: OpenCustomerDetailsService;
let navigateToSalesTab: NavigateToSalesTabService;
let extractSalesList: ExtractSalesListService;

let browser: Browser;
let page: Page;

describe('ExtractSalesList', () => {
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
    navigateToSalesTab = new NavigateToSalesTabService(page);
    extractSalesList = new ExtractSalesListService(page);
  });

  afterAll(async () => {
    // await browser.close();
  });

  it('should be able to extract sales list', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = ixcConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToCustomersPage.execute();

    const testingCustomerData = testingCustomersConfig[2];

    const customer = await findCustomerByField.execute({
      field: 'id',
      value: testingCustomerData.ixc.id,
    });

    await openCustomerDetails.execute({ customer_id: customer.id });

    await navigateToSalesTab.execute();

    const sales = await extractSalesList.execute();

    expect(sales).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          branch: expect.any(String),
          nf: expect.any(String),
          doc_type: expect.any(String),
          emission_date: expect.any(Date),
          departure_date: expect.any(Date),
          customer_name: expect.any(String),
          value: expect.any(Number),
          status: expect.any(String),
          printed: expect.any(Boolean),
          seller_name: expect.any(String),
          contract_r: expect.any(String),
          contract_a: expect.any(String),
          document: expect.any(String),
        }),
      ]),
    );
  });
});
