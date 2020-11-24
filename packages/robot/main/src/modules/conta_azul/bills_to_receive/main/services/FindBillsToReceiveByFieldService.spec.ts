import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';

import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import FindBillsToReceiveByFieldService from './FindBillsToReceiveByFieldService';
import NavigateToBillsToReceivePageService from './NavigateToBillsToReceivePageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToBillsToReceivePage: NavigateToBillsToReceivePageService;
let findBillsToReceiveByField: FindBillsToReceiveByFieldService;

let browser: Browser;
let page: Page;

describe('FindBillsToReceiveByField', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    navigateToLogInPage = new NavigateToLogInPageService(page);
    authenticateUser = new AuthenticateUserService(page);
    navigateToBillsToReceivePage = new NavigateToBillsToReceivePageService(
      page,
    );
    findBillsToReceiveByField = new FindBillsToReceiveByFieldService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to find bills to receive by field', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToBillsToReceivePage.execute();

    const testingCustomer = contaAzulConfig.testing.customers[0];

    const billsToReceiveByField = await findBillsToReceiveByField.execute({
      field: 'launch.customer_name',
      value: testingCustomer.name,
    });

    expect(billsToReceiveByField).toEqual(
      expect.arrayContaining([
        {
          expired: expect.any(Boolean),
          date: expect.any(Date),
          value: expect.any(Number),
          sell_id: expect.any(String),
          launch: {
            type: expect.any(String),
            customer_name: testingCustomer.name,
          },
        },
      ]),
    );
  });
});
