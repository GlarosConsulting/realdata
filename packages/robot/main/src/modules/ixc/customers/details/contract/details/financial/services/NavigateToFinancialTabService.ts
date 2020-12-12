import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

@injectable()
export default class NavigateToFinancialTabService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    const [
      findContractDetailsPageIdentifierElement,
    ] = await this.page.findElementsBySelector('#contrato');

    if (!findContractDetailsPageIdentifierElement) {
      throw new AppError(
        'You should be with the contract details window opened.',
      );
    }

    const [
      findAdditionalServicesTabElement,
    ] = await this.page.findElementsBySelector(
      'form[id="3_form"] div.abas.clearfix > ul > li:nth-child(11) > a',
    );

    await findAdditionalServicesTabElement.click();

    await this.page.driver.waitForSelector(
      '#cliente_contrato_cliente_contrato_rel_areceber',
    );
  }
}
