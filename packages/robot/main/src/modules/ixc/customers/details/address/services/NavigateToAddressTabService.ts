import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

@injectable()
export default class NavigateToAddressTabService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsBySelector(
      'form[name="cliente"] div.tDiv #novo_form',
    );

    if (!findCustomersWindowTitleElement) {
      throw new AppError(
        'You should be with the customer details window opened.',
      );
    }

    const [
      findAddressTabButtonElement,
    ] = await this.page.findElementsBySelector(
      'form > div.abas.clearfix > ul > li:nth-child(2) > a',
    );

    await findAddressTabButtonElement.click();

    await this.page.driver.waitForSelector('#cep');
  }
}
