import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';
import testingCustomersConfig from '@config/testing_customers';

import FindBillsToReceiveByFieldService from '@modules/conta_azul/bills_to_receive/main/services/FindBillsToReceiveByFieldService';
import NavigateToBillsToReceivePageService from '@modules/conta_azul/bills_to_receive/main/services/NavigateToBillsToReceivePageService';
import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import FillBillToReceiveDetailsDataService from './FillBillToReceiveDetailsDataService';
import OpenBillToReceiveDetailsService from './OpenBillToReceiveDetailsService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToBillsToReceivePage: NavigateToBillsToReceivePageService;
let findBillsToReceiveByField: FindBillsToReceiveByFieldService;
let openBillToReceiveDetails: OpenBillToReceiveDetailsService;
let fillBillToReceiveDetailsData: FillBillToReceiveDetailsDataService;

let browser: Browser;
let page: Page;

describe('FillBillToReceiveDetailsData', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch({ headless: false });
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
    fillBillToReceiveDetailsData = new FillBillToReceiveDetailsDataService(
      page,
    );
  });

  afterAll(async () => {
    // await browser.close();
  });

  it('should be able to fill bill to receive data', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToBillsToReceivePage.execute();

    const testingCustomer = testingCustomersConfig[0];

    const billsToReceiveByField = await findBillsToReceiveByField.execute({
      field: 'launch.customer_name',
      value: testingCustomer.name,
    });

    console.log(billsToReceiveByField);

    await openBillToReceiveDetails.execute({
      bill_to_receive_sell_id: billsToReceiveByField[0].sell_id,
    });

    const testingFinance = testingCustomer.ixc.details.finances[2];

    await fillBillToReceiveDetailsData.execute({
      account: 'Sicoob Crediuna',
      received_date: testingFinance.received_date,
      discount: 0,
      interest: testingFinance.paid_value - testingFinance.value,
      paid: testingFinance.paid_value,
      transaction_id: testingFinance.id,
      sell_id: testingFinance.sell_id,
    });
  });
});
