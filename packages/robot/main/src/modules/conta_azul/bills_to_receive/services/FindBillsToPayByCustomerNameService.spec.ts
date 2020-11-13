import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';

import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import FindBillsToPayByCustomerNameService from './FindBillsToPayByCustomerNameService';
import NavigateToBillsToReceivePageService from './NavigateToBillsToReceivePageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToBillsToReceivePage: NavigateToBillsToReceivePageService;
let findBillsToPayByCustomerName: FindBillsToPayByCustomerNameService;

let browser: Browser;
let page: Page;

describe('FindBillsToPayByCustomerName', () => {
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
    findBillsToPayByCustomerName = new FindBillsToPayByCustomerNameService(
      page,
    );
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to find bills to pay by field', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToBillsToReceivePage.execute();

    const testingCustomer = contaAzulConfig.testing.customers[0];

    const billsToPayByCustomerName = await findBillsToPayByCustomerName.execute(
      {
        customer_name: testingCustomer.name,
      },
    );

    expect(billsToPayByCustomerName).toEqual(
      expect.arrayContaining([
        {
          expired: expect.any(Boolean),
          date: expect.any(Date),
          value: expect.any(Number),
          launch: {
            type: expect.any(String),
            customer_name: testingCustomer.name,
          },
        },
      ]),
    );
  });
});
