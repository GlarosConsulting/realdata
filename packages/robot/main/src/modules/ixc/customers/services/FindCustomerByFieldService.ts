import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

import ICustomer from '@modules/ixc/customers/models/ICustomer';

import ExtractCustomersListService from './ExtractCustomersListService';

const FIELDS = {
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

  public async execute({ field, value }: IRequest): Promise<ICustomer> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError('You should be with the customers window opened.');
    }

    await this.page.driver.waitForSelector(
      'div.modal2 > div > div.sDiv > div > span',
    );

    const [findFieldSelectorElement] = await this.page.findElementsBySelector(
      'div.modal2 > div > div.sDiv > div > span:nth-child(1)',
    );

    await findFieldSelectorElement.click();

    await sleep(1000);

    await this.page.driver.waitForSelector(
      'div.modal2 > div > div.sDiv > nav > ul > li',
    );

    const [findFieldElement] = await this.page.findElementsBySelector(
      `div.modal2 > div > div.sDiv > nav > ul > li[data-nome="${FIELDS[field]}"]`,
    );

    await findFieldElement.click();

    const [findInputElement] = await this.page.findElementsBySelector(
      `div.modal2 > div > div.sDiv > div > input[placeholder="Consultar por ${FIELDS[field]}"]`,
    );

    await this.page.typeToElement(
      findInputElement,
      value + String.fromCharCode(13),
    );

    await sleep(1000);

    const customers = await this.extractCustomersList.execute();

    const findCustomer = customers.find(customer => customer[field] === value);

    return findCustomer;
  }
}
