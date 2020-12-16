import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

import ISaleIXC from '@modules/ixc/customers/details/sales/main/models/ISaleIXC';

interface IRequest {
  sale: ISaleIXC;
}

@injectable()
export default class OpenSaleDetailsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute({ sale }: IRequest): Promise<void> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError('You should be with the customers window opened.');
    }

    /* istanbul ignore next */
    await this.page.evaluate(saleId => {
      const element = document.evaluate(
        `//td[@abbr="vd_saida.id"]/div[contains(text(), '${saleId}')]/../..`,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;

      const clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent('dblclick', true, true);

      element.dispatchEvent(clickEvent);
    }, sale.id);

    await this.page.driver.waitForSelector('#id_condicao_pagamento_label');

    await sleep(2000);
  }
}
