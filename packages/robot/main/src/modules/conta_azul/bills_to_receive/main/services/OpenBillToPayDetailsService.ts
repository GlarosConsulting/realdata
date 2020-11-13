import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

interface IRequest {
  bill_to_pay_sell_id: string;
}

@injectable()
export default class OpenBillToPayDetailsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute({ bill_to_pay_sell_id }: IRequest): Promise<void> {
    const [
      findBillsToPayIdentifierElement,
    ] = await this.page.findElementsBySelector(
      '#addFinance > button.btn.btn-primary.primary-action',
    );

    if (!findBillsToPayIdentifierElement) {
      throw new AppError('You should be in bills to pay page.');
    }

    /* istanbul ignore next */
    await this.page.evaluate(async id => {
      const elements = document.querySelectorAll<HTMLElement>(
        'td.statement > div.statement-table > span',
      );

      console.log(elements);

      const findElement: HTMLElement = await new Promise(resolve => {
        elements.forEach(element => {
          console.log(element);

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

      console.log('found');
      console.log(findElement);

      if (findElement) {
        findElement.click();
      }
    }, bill_to_pay_sell_id);

    await this.page.driver.waitForSelector('h3#newModalTitle');

    await sleep(1000);
  }
}
