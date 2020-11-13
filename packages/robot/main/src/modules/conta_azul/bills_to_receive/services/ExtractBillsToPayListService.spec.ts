import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import contaAzulConfig from '@config/conta_azul';

import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

import ExtractBillsToPayListService from './ExtractBillsToPayListService';
import NavigateToBillsToReceivePageService from './NavigateToBillsToReceivePageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;
let authenticateUser: AuthenticateUserService;
let navigateToBillsToReceivePage: NavigateToBillsToReceivePageService;
let extractBillsToPayList: ExtractBillsToPayListService;

let browser: Browser;
let page: Page;

describe('ExtractBillsToPayList', () => {
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
    extractBillsToPayList = new ExtractBillsToPayListService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to extract customers list', async () => {
    await navigateToLogInPage.execute();

    const { email, password } = contaAzulConfig.testing.account;

    await authenticateUser.execute({
      email,
      password,
    });

    await navigateToBillsToReceivePage.execute();

    const billsToPay = await extractBillsToPayList.execute();

    expect(billsToPay).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
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
