import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import ICustomer from '@modules/ixc/customers/models/ICustomer';

interface IRequest {
  customer: ICustomer;
}

@injectable()
export default class OpenCustomerDetailsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute({ customer }: IRequest): Promise<void> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError('You should be with the customers window opened.');
    }

    const [findCustomerRowElement] = await this.page.findElementsByText(
      customer.id,
      'td[@abbr="cliente.id"]/div',
      '/../..',
    );

    if (!findCustomerRowElement) {
      throw new AppError('I was not able to find customer row on table.');
    }

    this.page.driver.evaluate(() => {
      const element = document.evaluate(
        '//td[@abbr="cliente.id"]/div[contains(text(), \'13892\')]/../..',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;

      const clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent('dblclick', true, true);

      element.dispatchEvent(clickEvent);
    });

    await this.page.driver.waitForSelector(
      'div.panel.mostrando input#id[name="id"]',
    );
  }
}
