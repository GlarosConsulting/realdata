import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

import ICustomer from '@modules/ixc/customers/main/models/ICustomer';

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

    /* istanbul ignore next */
    this.page.evaluate(customerId => {
      const element = document.evaluate(
        `//td[@abbr="cliente.id"]/div[contains(text(), '${customerId}')]/../..`,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;

      const clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent('dblclick', true, true);

      element.dispatchEvent(clickEvent);
    }, customer.id);

    await this.page.driver.waitForSelector(
      'div.panel.mostrando input#id[name="id"]',
    );

    await sleep(2000);
  }
}
