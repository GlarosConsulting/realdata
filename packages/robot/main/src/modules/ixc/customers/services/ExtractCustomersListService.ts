import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import ICustomer from '@modules/ixc/customers/models/ICustomer';

@injectable()
export default class ExtractCustomersListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<ICustomer[]> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError('You should be with the customers window opened.');
    }

    const [findTableBodyElement] = await this.page.findElementsBySelector(
      '#grid_1 > tbody',
    );

    if (!findTableBodyElement) {
      return [];
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const customers = await this.page.evaluate<ICustomer[]>(() => {
      const data: ICustomer[] = [];

      const tableRows = document.querySelectorAll('#grid_1 > tbody tr');

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

        const customer: ICustomer = {
          active,
          id,
          name: company_name,
          fantasy_name,
          document,
          identity,
        };

        data.push(customer as ICustomer);
      });

      return data;
    });

    return customers;
  }
}
