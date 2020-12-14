import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';

import ISaleIXC from '@modules/ixc/customers/details/sales/main/models/ISaleIXC';

interface IExtractSale
  extends Omit<ISaleIXC, 'emission_date' | 'departure_date'> {
  emission_date: string;
  departure_date: string;
}

@injectable()
export default class ExtractSalesListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<ISaleIXC[]> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError('You should be with the customers window opened.');
    }

    const [findTableBodyElement] = await this.page.findElementsBySelector(
      '#cliente_vd_saida > tbody',
    );

    if (!findTableBodyElement) {
      return [];
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const extractedContracts = await this.page.evaluate<IExtractSale[]>(() => {
      const data: IExtractSale[] = [];

      const parseValue = (str?: string): number =>
        str ? Number(str.replace(/\./g, '').replace(',', '.')) : 0;

      const tableRows = document.querySelectorAll(
        '#cliente_vd_saida > tbody tr',
      );

      tableRows.forEach(row => {
        const id = getTextBySelector('td.sorted > div', row);
        const branch = getTextBySelector('td:nth-child(2) > div', row);
        const nf = getTextBySelector('td:nth-child(3) > div', row);
        const doc_type = getTextBySelector('td:nth-child(4) > div', row);
        const emission_date = getTextBySelector('td:nth-child(5) > div', row);
        const departure_date = getTextBySelector('td:nth-child(6) > div', row);
        const customer_name = getTextBySelector('td:nth-child(7) > div', row);
        const value = getTextBySelector('td:nth-child(8) > div', row);
        const status = getTextBySelector(
          'td:nth-child(9) > div > font > font',
          row,
        );
        const printed = getTextBySelector('td:nth-child(10) > div', row);
        const seller_name = getTextBySelector('td:nth-child(12) > div', row);
        const contract_r = getTextBySelector('td:nth-child(13) > div', row);
        const contract_a = getTextBySelector('td:nth-child(14) > div', row);
        const document = getTextBySelector('td:nth-child(16) > div', row);

        const sale: IExtractSale = {
          id,
          branch,
          nf,
          doc_type,
          emission_date,
          departure_date,
          customer_name,
          value: parseValue(value),
          status,
          printed: printed === 'Sim',
          seller_name,
          contract_r,
          contract_a,
          document,
        };

        data.push(sale);
      });

      return data;
    });

    const sales = extractedContracts.map<ISaleIXC>(sale => ({
      ...sale,
      emission_date: parseDate(sale.emission_date),
      departure_date: parseDate(sale.departure_date),
    }));

    return sales;
  }
}
