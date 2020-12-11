import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';

import IContractIXC from '@modules/ixc/customers/details/contract/main/models/IContractIXC';

interface IExtractContract
  extends Omit<IContractIXC, 'activation_date' | 'base_date'> {
  activation_date: string;
  base_date: string;
}

@injectable()
export default class ExtractContractListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IContractIXC[]> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError('You should be with the customers window opened.');
    }

    const [findTableBodyElement] = await this.page.findElementsBySelector(
      '#cliente_cliente_contrato > tbody',
    );

    if (!findTableBodyElement) {
      return [];
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const extractedContracts = await this.page.evaluate<IExtractContract[]>(
      () => {
        const data: IExtractContract[] = [];

        const tableRows = document.querySelectorAll(
          '#cliente_cliente_contrato > tbody tr',
        );

        tableRows.forEach(row => {
          const id = getTextBySelector('td:nth-child(1) > div', row);
          const fil = getTextBySelector('td:nth-child(2) > div', row);
          const status = getTextBySelector(
            'td:nth-child(3) > div > span',
            row,
          ).includes('Ativo');
          const access_status = getTextBySelector(
            'td:nth-child(4) > div > span',
            row,
          ).includes('Ativo');
          const customer_name = getTextBySelector('td:nth-child(5) > div', row);
          const activation_date = getTextBySelector(
            'td:nth-child(6) > div',
            row,
          );
          const base_date = getTextBySelector('td:nth-child(7) > div', row);
          const type = getTextBySelector('td:nth-child(10) > div', row);
          const description = getTextBySelector('td:nth-child(11) > div', row);

          const contract: IExtractContract = {
            id,
            fil,
            status,
            access_status,
            customer_name,
            activation_date,
            base_date,
            type,
            description,
          };

          data.push(contract);
        });

        return data;
      },
    );

    const contracts = extractedContracts.map<IContractIXC>(contract => ({
      ...contract,
      activation_date: parseDate(contract.activation_date),
      base_date: parseDate(contract.activation_date),
    }));

    return contracts;
  }
}
