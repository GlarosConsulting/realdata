import { injectable, inject } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

@injectable()
export default class NavigateToCreateCustomerPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    const [
      findCreateCustomerButtonElement,
    ] = await this.page.findElementsBySelector(
      '#gateway > section > div > div.ds-page > nav > div > div > div.ds-action-bar__left > div > button',
    );

    findCreateCustomerButtonElement.click();

    await this.page.driver.waitForSelector(
      'body > div.ds-rollover.ds-rollover--is-opened > div.ds-rollover__header > div > div > h1',
    );

    await sleep(1000);
  }
}
