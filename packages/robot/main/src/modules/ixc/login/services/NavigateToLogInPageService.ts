import { injectable, inject } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import ixcConfig from '@config/ixc';

@injectable()
export default class NavigateToSignInPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    await this.page.goTo(ixcConfig.pages.login.url);

    await this.page.driver.waitForSelector('input#email[name="email"]');
  }
}
