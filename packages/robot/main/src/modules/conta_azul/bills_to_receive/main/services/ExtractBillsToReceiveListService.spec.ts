import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';

import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import ExtractBillsToReceiveListService from './ExtractBillsToReceiveListService';
import NavigateToBillsToReceivePageService from './NavigateToBillsToReceivePageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToBillsToReceivePage: NavigateToBillsToReceivePageService;
let extractBillsToReceiveList: ExtractBillsToReceiveListService;

let browser: Browser;
let page: Page;

describe('ExtractBillsToReceiveList', () => {
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
    extractBillsToReceiveList = new ExtractBillsToReceiveListService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to extract bills to receive list', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToBillsToReceivePage.execute();

    const billsToReceive = await extractBillsToReceiveList.execute();

    expect(billsToReceive).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          expired: expect.any(Boolean),
          date: expect.any(Date),
          value: expect.any(Number),
          launch: {
            type: expect.any(String),
            person_name: expect.any(String),
          },
        }),
      ]),
    );
  });
});
