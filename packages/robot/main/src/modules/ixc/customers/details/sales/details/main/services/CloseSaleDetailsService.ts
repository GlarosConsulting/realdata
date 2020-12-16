import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

@injectable()
export default class CloseSaleDetailsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    const [
      findContractDetailsPageIdentifierElement,
    ] = await this.page.findElementsBySelector('#filial_id_label');

    if (!findContractDetailsPageIdentifierElement) {
      throw new AppError('You should be with the sale details window opened.');
    }

    /* istanbul ignore next */
    await this.page.evaluate(() => {
      document
        .querySelector<HTMLElement>(
          'form[id="3_form"] > div.mDiv > div.btn_row > a.fa.fa-times',
        )
        .click();
    });

    await sleep(1000);

    await this.page.driver.waitForSelector('#cliente_vd_saida');
  }
}
