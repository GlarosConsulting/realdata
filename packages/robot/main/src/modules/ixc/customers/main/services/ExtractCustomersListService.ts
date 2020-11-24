import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import ICustomerIXC from '@modules/ixc/customers/main/models/ICustomerIXC';

@injectable()
export default class ExtractCustomersListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<ICustomerIXC[]> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError('You should be with the customers window opened.');
    }

    const [findTableBodyElement] = await this.page.findElementsBySelector(
      'table#grid_1 > tbody > tr',
    );

    if (!findTableBodyElement) {
      return [];
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const customers = await this.page.evaluate<ICustomerIXC[]>(() => {
      const data: ICustomerIXC[] = [];

      const tableRows = document.querySelectorAll('table#grid_1 > tbody > tr');

      console.log(tableRows);

      tableRows.forEach(row => {
        const active =
          row
            .querySelector('td:nth-child(1) > div > i')
            .getAttribute('title') === 'Sim';

        const id = getTextBySelector('td:nth-child(2) > div', row);
        const company_name = getTextBySelector('td:nth-child(4) > div', row);
        const fantasy_name = getTextBySelector('td:nth-child(5) > div', row);
        const document = getTextBySelector('td:nth-child(6) > div', row);
        const identity = getTextBySelector('td:nth-child(7) > div', row);

        const customer: ICustomerIXC = {
          active,
          id,
          name: company_name,
          fantasy_name,
          document,
          identity,
        };

        data.push(customer as ICustomerIXC);
      });

      return data;
    });

    return customers;
  }
}
