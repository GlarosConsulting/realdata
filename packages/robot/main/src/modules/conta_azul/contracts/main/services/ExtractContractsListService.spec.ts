import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';

import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import ExtractContractsListService from './ExtractContractsListService';
import NavigateToContractsPageService from './NavigateToContractsPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToContractsPage: NavigateToContractsPageService;
let extractContractsList: ExtractContractsListService;

let browser: Browser;
let page: Page;

describe('ExtractContractsList', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch({ headless: false });
  });

  beforeEach(async () => {
    page = await browser.newPage();

    navigateToLogInPage = new NavigateToLogInPageService(page);
    authenticateUser = new AuthenticateUserService(page);
    navigateToContractsPage = new NavigateToContractsPageService(page);
    extractContractsList = new ExtractContractsListService(page);
  });

  afterAll(async () => {
    // await browser.close();
  });

  it('should be able to extract contracts list', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToContractsPage.execute();

    const contracts = await extractContractsList.execute();

    expect(contracts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          customer_name: expect.any(String),
          active: expect.any(Boolean),
          next_billing_date: expect.any(Date),
          remaining_validity: expect.any(String),
          monthly_value: expect.any(Number),
        }),
      ]),
    );
  });
});
