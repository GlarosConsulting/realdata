import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

import ICustomerIXC from '@modules/ixc/customers/main/models/ICustomerIXC';

import ExtractCustomersListService from './ExtractCustomersListService';

export const FIELDS = {
  id: 'ID',
};

interface IRequest {
  field: keyof typeof FIELDS;
  value: string;
}

@injectable()
export default class FindCustomerByFieldService {
  private extractCustomersList: ExtractCustomersListService;

  constructor(
    @inject('Page')
    private page: Page,
  ) {
    this.extractCustomersList = new ExtractCustomersListService(page);
  }

  public async execute({
    field,
    value,
  }: IRequest): Promise<ICustomerIXC | null> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError('You should be with the customers window opened.');
    }

    /* istanbul ignore next */
    await this.page.evaluate(fieldName => {
      document
        .querySelector<HTMLElement>(
          `div.modal2 > div > div.sDiv > nav > ul > li[data-nome="${fieldName}"]`,
        )
        .click();
    }, FIELDS[field]);

    const [findInputElement] = await this.page.findElementsBySelector(
      `div.modal2 > div > div.sDiv > div > input[placeholder="Consultar por ${FIELDS[field]}"]`,
    );

    await this.page.driver.keyboard.press('Backspace');

    await sleep(500);

    await this.page.typeToElement(findInputElement, value);

    await sleep(500);

    await this.page.typeToElement(findInputElement, String.fromCharCode(13));

    await sleep(500);

    await this.page.typeToElement(findInputElement, String.fromCharCode(13));

    try {
      await this.page.driver.waitForSelector(
        'div.modal2 div.bDiv table tbody tr',
        {
          timeout: 2000,
        },
      );
    } catch {
      return null;
    }

    await sleep(1000);

    const customers = await this.extractCustomersList.execute();

    const findCustomer = customers.find(customer => customer[field] === value);

    await sleep(500);

    return findCustomer;
  }
}
