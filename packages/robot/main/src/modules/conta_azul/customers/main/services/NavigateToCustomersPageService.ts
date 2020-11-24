import { injectable, inject } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import contaAzulConfig from '@config/conta_azul';

import sleep from '@utils/sleep';

@injectable()
export default class NavigateToCustomersPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    await this.page.goTo(contaAzulConfig.pages.customers.url);

    await this.page.driver.waitForSelector('#gateway > section > div > h1');

    await sleep(2000);
  }
}
