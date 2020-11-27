import { addDays } from 'date-fns';

import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';
import testingCustomersConfig from '@config/testing_customers';

import formatIxcContractProductsToContaAzul from '@utils/formatIxcContractProductsToContaAzul';

import NavigateToCustomersPageService from '@modules/conta_azul/customers/main/services/NavigateToCustomersPageService';
import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import FillCreateContractDataService from './FillCreateContractDataService';
import NavigateToCreateContractPageService from './NavigateToCreateContractPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToCustomersPage: NavigateToCustomersPageService;
let navigateToCreateContractPage: NavigateToCreateContractPageService;
let fillCreateContractData: FillCreateContractDataService;

let browser: Browser;
let page: Page;

describe('FillCreateContractData', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch({ headless: false });
  });

  beforeEach(async () => {
    page = await browser.newPage();

    navigateToLogInPage = new NavigateToLogInPageService(page);
    authenticateUser = new AuthenticateUserService(page);
    navigateToCustomersPage = new NavigateToCustomersPageService(page);
    navigateToCreateContractPage = new NavigateToCreateContractPageService(
      page,
    );
    fillCreateContractData = new FillCreateContractDataService(page);
  });

  afterAll(async () => {
    // await browser.close();
  });

  it('should be able to fill create contract data', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToCustomersPage.execute();

    await navigateToCreateContractPage.execute();

    const testingCustomer = testingCustomersConfig[3];
    const testingContract = testingCustomer.ixc.details.contracts[0];

    await fillCreateContractData.execute({
      document: testingCustomer.document,
      category: 'Vendas',
      sell_date: addDays(testingContract.activation_date, 2).toISOString(),
      always_charge_on_day: 5,
      products: formatIxcContractProductsToContaAzul([
        ...testingContract.products.items,
      ]),
    });
  });
});
