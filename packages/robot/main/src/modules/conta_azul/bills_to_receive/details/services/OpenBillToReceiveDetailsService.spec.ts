import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';

import FindBillsToReceiveByFieldService from '@modules/conta_azul/bills_to_receive/main/services/FindBillsToReceiveByFieldService';
import NavigateToBillsToReceivePageService from '@modules/conta_azul/bills_to_receive/main/services/NavigateToBillsToReceivePageService';
import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import OpenBillToReceiveDetailsService from './OpenBillToReceiveDetailsService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToBillsToReceivePage: NavigateToBillsToReceivePageService;
let findBillsToReceiveByField: FindBillsToReceiveByFieldService;
let openBillToReceiveDetails: OpenBillToReceiveDetailsService;

let browser: Browser;
let page: Page;

describe('OpenBillToReceiveDetails', () => {
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
    openBillToReceiveDetails = new OpenBillToReceiveDetailsService(page);
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

    console.log(billsToReceiveByField);

    await openBillToReceiveDetails.execute({
      bill_to_receive_sell_id: billsToReceiveByField[0].sell_id,
    });

    const [
      findOpenedBillToReceiveDetailsIdentifierElement,
    ] = await page.findElementsBySelector('h3#newModalTitle');

    expect(findOpenedBillToReceiveDetailsIdentifierElement).toBeTruthy();
  });
});
