import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import ICustomerContaAzul from '@modules/conta_azul/customers/models/ICustomerContaAzul';

@injectable()
export default class ExtractBillsToPayListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<ICustomerContaAzul[]> {
    const [findCustomersTitleElement] = await this.page.findElementsBySelector(
      '#addFinance > button.btn.btn-primary.primary-action',
    );

    if (!findCustomersTitleElement) {
      throw new AppError('You should be in bills to pay page.');
    }

    const [findTableBodyElement] = await this.page.findElementsBySelector(
      'div#statement-list-container > table > tbody',
    );

    if (!findTableBodyElement) {
      return [];
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const customers = await this.page.evaluate<ICustomerContaAzul[]>(() => {
      const data: ICustomerContaAzul[] = [];

      const tableRows = document.querySelectorAll(
        'div#statement-list-container > table > tbody',
      );

      tableRows.forEach(row => {
        const date = getTextBySelector('td.new_tooltip', row);
        const document = getTextBySelector('td:nth-child(3)', row);
        const email = getTextBySelector('td:nth-child(4)', row);
        const phone = getTextBySelector('td:nth-child(5)', row);
        const active =
          getTextBySelector('td:nth-child(6) > span > b', row) === 'Ativo';

        const customer: ICustomerContaAzul = {
          name,
          document,
          email,
          phone,
          active,
        };

        data.push(customer as ICustomerContaAzul);
      });

      return data;
    });

    return customers;
  }
}
