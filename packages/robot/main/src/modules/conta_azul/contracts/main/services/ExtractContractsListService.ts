import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';

import IContractContaAzul from '@modules/conta_azul/contracts/main/models/IContractContaAzul';

interface IExtractContractContaAzul
  extends Omit<IContractContaAzul, 'next_billing_date'> {
  next_billing_date: string;
}

@injectable()
export default class ExtractContractsListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IContractContaAzul[]> {
    const [
      findCreateContractButtonElement,
    ] = await this.page.findElementsBySelector(
      '#conteudo > div.row.ca-u-margin-top.ng-scope > div > div > div.col-xs-2 > button',
    );

    if (!findCreateContractButtonElement) {
      throw new AppError('You should be in contracts page.');
    }

    const [findTableBodyElement] = await this.page.findElementsBySelector(
      '#conteudo > table > tbody',
    );

    if (!findTableBodyElement) {
      return [];
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const extractedContracts = await this.page.evaluate<
      IExtractContractContaAzul[]
    >(() => {
      const data: IExtractContractContaAzul[] = [];

      const tableRows = document.querySelectorAll(
        '#conteudo > table > tbody tr',
      );

      tableRows.forEach(row => {
        const customer_name = getTextBySelector(
          'td.ca-u-limit-text.ng-binding',
          row,
        );
        const active = getTextBySelector(
          'ca-pill > span > ng-transclude > span',
          row,
        ).includes('Ativo');
        const next_billing_date = getTextBySelector('td:nth-child(3)', row);
        const remaining_validity = getTextBySelector('td.ng-scope', row);
        const monthly_value = getTextBySelector(
          'td.ca-u-text-right.semi-bold-title.ng-binding',
          row,
        );

        const contract: IExtractContractContaAzul = {
          customer_name,
          active,
          next_billing_date,
          remaining_validity,
          monthly_value: Number(
            monthly_value.replace(/\./g, '').replace(',', '.'),
          ),
        };

        data.push(contract as IExtractContractContaAzul);
      });

      return data;
    });

    const contracts = extractedContracts.map<IContractContaAzul>(contract => ({
      ...contract,
      next_billing_date: parseDate(contract.next_billing_date),
    }));

    return contracts;
  }
}
