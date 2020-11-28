import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

@injectable()
export default class CloseCustomerDetailsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError('You should be with the customers window opened.');
    }

    const [findCloseButtonElement] = await this.page.findElementsBySelector(
      'form[id="2_form"] > div.mDiv > div.btn_row > a.fa.fa-times',
    );

    await findCloseButtonElement.click();

    await sleep(1000);
  }
}
