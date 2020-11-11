import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import PuppeteerBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/implementations/PuppeteerBrowserProvider';

import NavigateToLogInPageService from './NavigateToLogInPageService';

let puppeteerBrowserProvider: PuppeteerBrowserProvider;
let navigateToLogInPage: NavigateToLogInPageService;

let browser: Browser;
let page: Page;

describe('NavigateToSignInPage', () => {
  beforeAll(async () => {
    puppeteerBrowserProvider = new PuppeteerBrowserProvider();

    browser = await puppeteerBrowserProvider.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();

    navigateToLogInPage = new NavigateToLogInPageService(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should be able to navigate to log in page', async () => {
    const goTo = jest.spyOn(page, 'goTo');

    await navigateToLogInPage.execute();

    expect(goTo).toHaveBeenCalled();
  });
});
