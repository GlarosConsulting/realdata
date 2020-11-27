import { injectable, inject } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import contaAzulConfig from '@config/conta_azul';

import sleep from '@utils/sleep';

@injectable()
export default class NavigateToCreateContractPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    await this.page.goTo(contaAzulConfig.pages.contracts.create.url);

    await this.page.driver.waitForSelector(
      '#negotiation > form > div > ng-transclude > div > div:nth-child(4) > div.col-xs-offset-1.col-xs-3.ng-scope > ca-field > div > ng-transclude > caf-customer-search-select > div > ca-search-select > div > ca-select > div > button',
    );

    await sleep(2000);
  }
}
