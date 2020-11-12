import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import ICustomerContaAzul from '@modules/conta_azul/customers/models/ICustomerContaAzul';

@injectable()
export default class ExtractCustomersListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<ICustomerContaAzul[]> {
    const [findCustomersTitleElement] = await this.page.findElementsByText(
      ' Cadastro de clientes ',
      'h1',
    );

    if (!findCustomersTitleElement) {
      throw new AppError('You should be in customers page.');
    }

    const [findTableBodyElement] = await this.page.findElementsBySelector(
      'table > tbody',
    );

    if (!findTableBodyElement) {
      return [];
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const customers = await this.page.evaluate<ICustomerContaAzul[]>(() => {
      const data: ICustomerContaAzul[] = [];

      const tableRows = document.querySelectorAll('table > tbody tr');

      tableRows.forEach(row => {
        const name = getTextBySelector('td:nth-child(2)', row);
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
