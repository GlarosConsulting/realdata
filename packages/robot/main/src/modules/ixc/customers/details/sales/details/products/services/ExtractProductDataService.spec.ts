import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import ixcConfig from '@config/ixc';
import testingCustomersConfig from '@config/testing_customers';

import OpenContractDetailsService from '@modules/ixc/customers/details/contract/details/main/services/OpenContractDetailsService';
import ExtractContractListService from '@modules/ixc/customers/details/contract/main/services/ExtractContractListService';
import NavigateToContractTabService from '@modules/ixc/customers/details/contract/main/services/NavigateToContractTabService';
import OpenCustomerDetailsService from '@modules/ixc/customers/details/main/services/OpenCustomerDetailsService';
import FindCustomerByFieldService from '@modules/ixc/customers/main/services/FindCustomerByFieldService';
import NavigateToCustomersPageService from '@modules/ixc/customers/main/services/NavigateToCustomersPageService';
import AuthenticateUserService from '@modules/ixc/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/ixc/login/services/NavigateToLogInPageService';

import ExtractProductDataService from './ExtractProductDataService';
import NavigateToProductTabService from './NavigateToProductTabService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToCustomersPage: NavigateToCustomersPageService;
let findCustomerByField: FindCustomerByFieldService;
let openCustomerDetails: OpenCustomerDetailsService;
let navigateToContractTab: NavigateToContractTabService;
let extractContractList: ExtractContractListService;
let openContractDetails: OpenContractDetailsService;
let navigateToProductTab: NavigateToProductTabService;
let extractProductData: ExtractProductDataService;

let browser: Browser;
let page: Page;

describe('ExtractProductList', () => {
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
    navigateToContractTab = new NavigateToContractTabService(page);
    extractContractList = new ExtractContractListService(page);
    openContractDetails = new OpenContractDetailsService(page);
    navigateToProductTab = new NavigateToProductTabService(page);
    extractProductData = new ExtractProductDataService(page);
  });

  afterAll(async () => {
    // await browser.close();
  });

  it('should be able to navigate to product tab', async () => {
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

    await navigateToContractTab.execute();

    const [contract] = await extractContractList.execute();

    await openContractDetails.execute({ contract });

    await navigateToProductTab.execute();

    const productData = await extractProductData.execute();

    expect(productData).toEqual(
      expect.objectContaining({
        gross_value: expect.any(Number),
        net_value: expect.any(Number),
        items: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            description: expect.any(String),
            plan: expect.any(String),
            service: expect.any(String),
            amount: expect.any(Number),
            unit_value: expect.any(Number),
            gross_value: expect.any(Number),
            net_value: expect.any(Number),
            contract_id: expect.any(String),
          }),
        ]),
      }),
    );
  });
});
