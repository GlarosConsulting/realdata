import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';

import IBillToPay from '@modules/conta_azul/bills_to_receive/models/IBillToPay';

interface IExtractBillToPay extends Omit<IBillToPay, 'date'> {
  date: string;
}

@injectable()
export default class ExtractBillsToPayListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IBillToPay[]> {
    const [findCustomersTitleElement] = await this.page.findElementsBySelector(
      'table > tbody > tr > td',
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
    const extractedBillsToPay = await this.page.evaluate<IExtractBillToPay[]>(
      () => {
        const data: IExtractBillToPay[] = [];

        const tableRows = document.querySelectorAll(
          'div#statement-list-container > table > tbody > tr',
        );

        console.log(tableRows);

        tableRows.forEach(row => {
          const expired = row.getAttribute('class') === 'vencido';

          const date = getTextBySelector('td.new_tooltip', row);
          const value = Number(
            getTextBySelector(
              'td.right.value-column > div.act-mailsender-value.statement-value',
              row,
            ).replace(',', '.'),
          );
          const type = getTextBySelector('td.statement > span', row);
          const customer_name = getTextBySelector(
            'td.statement > div.statement-table > span.limit-text.span1-max.description-left.client-label.act-client-label.show.new_tooltip',
            row,
          );

          const billToPay: IExtractBillToPay = {
            expired,
            date,
            value,
            launch: {
              type,
              customer_name,
            },
          };

          data.push(billToPay);
        });

        return data;
      },
    );

    const billsToPay = extractedBillsToPay.map<IBillToPay>(billToPay => ({
      ...billToPay,
      date: parseDate(billToPay.date),
    }));

    return billsToPay;
  }
}
