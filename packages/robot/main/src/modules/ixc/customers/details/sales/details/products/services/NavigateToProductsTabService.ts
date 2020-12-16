import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

@injectable()
export default class NavigateToProductsTabService {
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

    const [findProductsTabElement] = await this.page.findElementsBySelector(
      'form[id="3_form"] > div.abas.clearfix > ul > li:nth-child(4) > a',
    );

    await findProductsTabElement.click();

    await this.page.driver.waitForSelector('#vd_saida_vd_saida_produtos');
  }
}
