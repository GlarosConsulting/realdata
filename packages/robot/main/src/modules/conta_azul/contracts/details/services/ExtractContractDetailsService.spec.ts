import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';
import testingCustomersConfig from '@config/testing_customers';

import FindContractsByCustomerNameService from '@modules/conta_azul/contracts/main/services/FindContractsByCustomerNameService';
import NavigateToContractsPageService from '@modules/conta_azul/contracts/main/services/NavigateToContractsPageService';
import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import ExtractContractDetailsService from './ExtractContractDetailsService';
import NavigateToContractDetailsService from './NavigateToContractDetailsService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToContractsPage: NavigateToContractsPageService;
let findContractsByCustomerName: FindContractsByCustomerNameService;
let navigateToContractDetails: NavigateToContractDetailsService;
let extractContractDetails: ExtractContractDetailsService;

let browser: Browser;
let page: Page;

describe('OpenContractDetails', () => {
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
    navigateToContractDetails = new NavigateToContractDetailsService(page);
    extractContractDetails = new ExtractContractDetailsService(page);
  });

  afterAll(async () => {
    // await browser.close();
  });

  it('should be able to extract contract details', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToContractsPage.execute();

    const testingCustomer = testingCustomersConfig[0];

    const [contract] = await findContractsByCustomerName.execute({
      name: testingCustomer.name,
    });

    await navigateToContractDetails.execute({ contract });

    const contractDetails = await extractContractDetails.execute();

    expect(contractDetails).toEqual(
      expect.objectContaining({
        start_date: expect.any(Date),
        next_billing_date: expect.any(Date),
        frequency: expect.any(String),
        charging: expect.any(String),
        remaining_validity: expect.any(String),
        products: expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            description: expect.any(String),
            amount: expect.any(Number),
            unit_value: expect.any(Number),
          }),
        ]),
      }),
    );
  });
});
