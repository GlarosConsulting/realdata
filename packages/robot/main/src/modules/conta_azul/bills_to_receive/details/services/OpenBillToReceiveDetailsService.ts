import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

interface IRequest {
  bill_to_receive_sell_id: string;
}

@injectable()
export default class OpenBillToReceiveDetailsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute({ bill_to_receive_sell_id }: IRequest): Promise<void> {
    const [
      findBillsToReceiveIdentifierElement,
    ] = await this.page.findElementsBySelector(
      '#addFinance > button.btn.btn-primary.primary-action',
    );

    if (!findBillsToReceiveIdentifierElement) {
      throw new AppError('You should be in bills to pay page.');
    }

    await sleep(500);

    /* istanbul ignore next */
    await this.page.evaluate(async id => {
      const elements = document.querySelectorAll<HTMLElement>(
        'td.statement > div.statement-table > span',
      );

      const findElement: HTMLElement = await new Promise(resolve => {
        elements.forEach(element => {
          let dataOriginalTitle = element.getAttribute('data-original-title');

          if (dataOriginalTitle) {
            dataOriginalTitle = dataOriginalTitle
              .replace('(', '')
              .replace(')', '');

            if (dataOriginalTitle.includes(id)) {
              resolve(element);
            }
          }
        });
      });

      if (findElement) {
        findElement.click();
      }
    }, bill_to_receive_sell_id);

    await sleep(500);

    await this.page.driver.waitForSelector('h3#newModalTitle');

    await sleep(1000);
  }
}
