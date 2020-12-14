import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

@injectable()
export default class DisableContractService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(dontSave = true): Promise<void> {
    const [
      findContractDetailsPageIdentifierElement,
    ] = await this.page.findElementsBySelector(
      '#conteudo > div:nth-child(1) > div:nth-child(2) > button',
    );

    if (!findContractDetailsPageIdentifierElement) {
      throw new AppError('You should be in contract details page.');
    }

    /* istanbul ignore next */
    await this.page.evaluate(() => {
      document
        .querySelector<HTMLElement>(
          '#conteudo > div:nth-child(3) > div:nth-child(3) > div:nth-child(1) > ca-collapse > div > div.ca-collapse-body > div > ng-transclude > table > tbody > tr:nth-child(1) > td:nth-child(3) > button',
        )
        .click();
    });

    await sleep(1000);

    if (!dontSave) {
      const [
        findUpcomingPurchasesRadioElement,
      ] = await this.page.findElementsBySelector(
        '#newPopupManagerReplacement > div > div.modal-body > div > ul > li:nth-child(2) > label',
      );

      await findUpcomingPurchasesRadioElement.click();

      const [findSaveButtonElement] = await this.page.findElementsBySelector(
        '#btnDeleteRecurrencyPurchases',
      );

      await findSaveButtonElement.click();

      await this.page.driver.waitForSelector(
        '#conteudo > div:nth-child(3) > div:nth-child(3) > div:nth-child(1) > ca-collapse > div > div.ca-collapse-body > div > ng-transclude > table > tbody > tr:nth-child(1) > td:nth-child(2) > span > span.halflings.info-sign.checkout-information-icon > i',
      );
    }
  }
}
