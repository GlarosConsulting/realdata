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

import ExtractAdditionalServiceListService from './ExtractAdditionalServiceListService';
import NavigateToAdditionalServicesTabService from './NavigateToAdditionalServicesTabService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToCustomersPage: NavigateToCustomersPageService;
let findCustomerByField: FindCustomerByFieldService;
let openCustomerDetails: OpenCustomerDetailsService;
let navigateToContractTab: NavigateToContractTabService;
let extractContractList: ExtractContractListService;
let openContractDetails: OpenContractDetailsService;
let navigateToAdditionalServicesTab: NavigateToAdditionalServicesTabService;
let extractAdditionalServiceList: ExtractAdditionalServiceListService;

let browser: Browser;
let page: Page;

describe('ExtractAdditionalServiceList', () => {
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
    navigateToAdditionalServicesTab = new NavigateToAdditionalServicesTabService(
      page,
    );
    extractAdditionalServiceList = new ExtractAdditionalServiceListService(
      page,
    );
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

    const testingCustomerData = testingCustomersConfig[4];

    const customer = await findCustomerByField.execute({
      field: 'id',
      value: testingCustomerData.ixc.id,
    });

    await openCustomerDetails.execute({ customer_id: customer.id });

    await navigateToContractTab.execute();

    const [contract] = await extractContractList.execute();

    await openContractDetails.execute({ contract });

    await navigateToAdditionalServicesTab.execute();

    const additionalServices = await extractAdditionalServiceList.execute();

    expect(additionalServices).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          date: expect.any(Date),
          contract: expect.any(String),
          product: expect.any(String),
          description: expect.any(String),
          amount: expect.any(Number),
          unit_value: expect.any(Number),
          total_value: expect.any(Number),
          repeat: expect.any(String),
          repeat_amount: expect.any(Number),
          status: expect.any(String),
          executions: expect.any(Number),
        }),
      ]),
    );
  });
});
