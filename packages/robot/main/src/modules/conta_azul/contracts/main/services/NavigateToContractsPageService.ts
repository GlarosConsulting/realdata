import { injectable, inject } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import contaAzulConfig from '@config/conta_azul';

import sleep from '@utils/sleep';

@injectable()
export default class NavigateToContractsPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    await this.page.goTo(contaAzulConfig.pages.contracts.main.url);

    await this.page.driver.waitForSelector(
      '#conteudo > div.row.ca-u-margin-top.ng-scope > div > div > div.col-xs-2 > button',
    );

    await sleep(2000);
  }
}
