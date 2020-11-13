import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';

import FindBillsToPayByFieldService from '@modules/conta_azul/bills_to_receive/main/services/FindBillsToPayByFieldService';
import NavigateToBillsToReceivePageService from '@modules/conta_azul/bills_to_receive/main/services/NavigateToBillsToReceivePageService';
import OpenBillToPayDetailsService from '@modules/conta_azul/bills_to_receive/main/services/OpenBillToPayDetailsService';
import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import FillBillToPayDetailsDataService from './FillBillToPayDetailsDataService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToBillsToReceivePage: NavigateToBillsToReceivePageService;
let findBillsToPayByField: FindBillsToPayByFieldService;
let openBillToPayDetails: OpenBillToPayDetailsService;
let fillBillToPayDetailsData: FillBillToPayDetailsDataService;

let browser: Browser;
let page: Page;

describe('FillBillToPayDetailsData', () => {
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
    findBillsToPayByField = new FindBillsToPayByFieldService(page);
    openBillToPayDetails = new OpenBillToPayDetailsService(page);
    fillBillToPayDetailsData = new FillBillToPayDetailsDataService(page);
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

    const billsToPayByField = await findBillsToPayByField.execute({
      field: 'launch.customer_name',
      value: testingCustomer.name,
    });

    console.log(billsToPayByField);

    await openBillToPayDetails.execute({
      bill_to_pay_sell_id: billsToPayByField[0].sell_id,
    });

    await fillBillToPayDetailsData.execute({ account: 'Sicoob' });
  });
});
