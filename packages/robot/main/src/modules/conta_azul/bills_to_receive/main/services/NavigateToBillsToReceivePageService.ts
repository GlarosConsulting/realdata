import { injectable, inject } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import contaAzulConfig from '@config/conta_azul';

import sleep from '@utils/sleep';

@injectable()
export default class NavigateToBillsToReceivePageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    await this.page.goTo(contaAzulConfig.pages.bills_to_receive.url);

    await Promise.all([
      this.page.driver.waitForSelector(
        '#addFinance > button.btn.btn-primary.primary-action',
      ),
      this.page.driver.waitForSelector('table > tbody > tr > td'),
    ]);

    await sleep(1000);
  }
}
