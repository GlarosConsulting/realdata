import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import ixcConfig from '@config/ixc';
import testingCustomersConfig from '@config/testing_customers';

import OpenCustomerDetailsService from '@modules/ixc/customers/details/main/services/OpenCustomerDetailsService';
import ExtractSalesListService from '@modules/ixc/customers/details/sales/main/services/ExtractSalesListService';
import NavigateToSalesTabService from '@modules/ixc/customers/details/sales/main/services/NavigateToSalesTabService';
import FindCustomerByFieldService from '@modules/ixc/customers/main/services/FindCustomerByFieldService';
import NavigateToCustomersPageService from '@modules/ixc/customers/main/services/NavigateToCustomersPageService';
import AuthenticateUserService from '@modules/ixc/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/ixc/login/services/NavigateToLogInPageService';

import OpenSaleDetailsService from './OpenSaleDetailsService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToCustomersPage: NavigateToCustomersPageService;
let findCustomerByField: FindCustomerByFieldService;
let openCustomerDetails: OpenCustomerDetailsService;
let navigateToSalesTab: NavigateToSalesTabService;
let extractSalesList: ExtractSalesListService;
let openSaleDetails: OpenSaleDetailsService;

let browser: Browser;
let page: Page;

describe('OpenSaleDetails', () => {
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
    openSaleDetails = new OpenSaleDetailsService(page);
  });

  afterAll(async () => {
    // await browser.close();
  });

  it('should be able to open sale details', async () => {
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

    const [sale] = await extractSalesList.execute();

    await openSaleDetails.execute({ sale });
  });
});
