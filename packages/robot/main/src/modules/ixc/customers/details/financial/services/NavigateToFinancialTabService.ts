import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

@injectable()
export default class NavigateToFinancialTabService {
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
        'You should be with the customers window opened in financial tab.',
      );
    }

    await sleep(500);

    const [
      findFinanceTabButtonElement,
    ] = await this.page.findElementsBySelector(
      'form > div.abas.clearfix > ul > li:nth-child(9) > a',
    );

    await findFinanceTabButtonElement.click();

    await this.page.driver.waitForSelector(
      'div.panel.mostrando > dl > div > div > div.hDiv > div > table > thead > tr > th.sorted > div',
    );

    const [
      findShowCanceledCheckboxElement,
    ] = await this.page.findElementsBySelector(
      'div.panel.mostrando > dl > div > div > div.tDiv.bg2 > div.tDiv2 > span:nth-child(6) > input[type=checkbox]',
    );

    await findShowCanceledCheckboxElement.click();

    await sleep(1000);
  }
}
