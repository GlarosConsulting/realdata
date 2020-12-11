import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

import IContractIXC from '@modules/ixc/customers/details/contract/main/models/IContractIXC';

interface IRequest {
  contract: IContractIXC;
}

@injectable()
export default class OpenContractDetailsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute({ contract }: IRequest): Promise<void> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError('You should be with the customers window opened.');
    }

    /* istanbul ignore next */
    await this.page.evaluate(contractId => {
      const element = document.evaluate(
        `//td[@abbr="cliente_contrato.id"]/div[contains(text(), '${contractId}')]/../..`,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;

      const clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent('dblclick', true, true);

      element.dispatchEvent(clickEvent);
    }, contract.id);

    await this.page.driver.waitForSelector('#contrato');

    await sleep(2000);
  }
}
