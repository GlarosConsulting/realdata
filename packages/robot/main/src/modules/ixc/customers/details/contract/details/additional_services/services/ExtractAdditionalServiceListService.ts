import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';

import IContractAdditionalServiceItem from '@modules/ixc/customers/details/contract/details/additional_services/models/IContractAdditionalServiceItem';

interface IExtractContractAdditionalServiceItem
  extends Omit<IContractAdditionalServiceItem, 'date'> {
  date: string;
}

@injectable()
export default class ExtractAdditionalServiceListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IContractAdditionalServiceItem[]> {
    const [
      findContractDetailsPageIdentifierElement,
    ] = await this.page.findElementsBySelector('#contrato');

    if (!findContractDetailsPageIdentifierElement) {
      throw new AppError(
        'You should be with the contract details window opened.',
      );
    }

    /* istanbul ignore next */
    const extractedAdditionalServices = await this.page.evaluate<
      IExtractContractAdditionalServiceItem[]
    >(() => {
      const data: IExtractContractAdditionalServiceItem[] = [];

      const tableRows = document.querySelectorAll(
        '#cliente_contrato_cliente_contrato_servicos > tbody tr',
      );

      const parseValue = (value: string) =>
        Number(value.replace(/\./g, '').replace(',', '.'));

      tableRows.forEach(row => {
        const id = getTextBySelector('td:nth-child(1) > div', row);
        const date = getTextBySelector('td:nth-child(2) > div', row);
        const contract = getTextBySelector('td:nth-child(3) > div', row);
        const product = getTextBySelector('td:nth-child(4) > div', row);
        const description = getTextBySelector('td:nth-child(5) > div', row);
        const amount = getTextBySelector('td:nth-child(6) > div', row);
        const unit_value = getTextBySelector('td:nth-child(7) > div', row);
        const total_value = getTextBySelector('td:nth-child(8) > div', row);
        const repeat = getTextBySelector('td:nth-child(9) > div', row);
        const repeat_amount = getTextBySelector('td:nth-child(10) > div', row);
        const status = getTextBySelector('td:nth-child(11) > div > font', row);
        const executions = getTextBySelector('td:nth-child(12) > div', row);

        const contractProductItem: IExtractContractAdditionalServiceItem = {
          id,
          date,
          contract,
          product,
          description,
          amount: parseValue(amount),
          unit_value: parseValue(unit_value),
          total_value: parseValue(total_value),
          repeat,
          repeat_amount: parseValue(repeat_amount),
          status,
          executions: parseValue(executions),
        };

        data.push(contractProductItem);
      });

      return data;
    });

    const additionalServices = extractedAdditionalServices.map<
      IContractAdditionalServiceItem
    >(additionalService => ({
      ...additionalService,
      date: parseDate(additionalService.date),
    }));

    return additionalServices;
  }
}
