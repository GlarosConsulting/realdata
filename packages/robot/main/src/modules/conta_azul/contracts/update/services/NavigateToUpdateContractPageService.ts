import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

@injectable()
export default class NavigateToUpdateContractPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    const [
      findContractDetailsPageIdentifierElement,
    ] = await this.page.findElementsBySelector(
      '#conteudo > div:nth-child(2) > div:nth-child(3) > div.col-xs-6 > permission-based-link > ca-link > span > ca-button > button > ng-transclude > ng-transclude > span > span',
    );

    if (!findContractDetailsPageIdentifierElement) {
      throw new AppError('You should be in contract details page.');
    }

    const [findUpdateButtonElement] = await this.page.findElementsBySelector(
      '#conteudo > div:nth-child(1) > div:nth-child(2) > button',
    );

    await findUpdateButtonElement.click();

    await sleep(500);

    await this.page.driver.waitForSelector(
      '#negotiation > form > div > ng-transclude > div > div:nth-child(4) > div.col-xs-offset-1.col-xs-3.ng-scope > ca-field > div > ng-transclude > caf-customer-search-select > div > ca-search-select > div > ca-select > div > button',
    );

    await sleep(1000);
  }
}
