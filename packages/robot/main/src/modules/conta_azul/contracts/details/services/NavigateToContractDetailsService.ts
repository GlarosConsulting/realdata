import { format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

import IContractContaAzul from '@modules/conta_azul/contracts/main/models/IContractContaAzul';

interface IRequest {
  contract: IContractContaAzul;
}

@injectable()
export default class NavigateToContractDetailsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute({ contract }: IRequest): Promise<void> {
    const [
      findCreateContractButtonElement,
    ] = await this.page.findElementsBySelector(
      '#conteudo > div.row.ca-u-margin-top.ng-scope > div > div > div.col-xs-2 > button',
    );

    if (!findCreateContractButtonElement) {
      throw new AppError('You should be in contracts page.');
    }

    /* istanbul ignore next */
    await this.page.evaluate(
      async evaluatedData => {
        console.log(evaluatedData);

        const tableRows = document.querySelectorAll<HTMLElement>(
          '#conteudo > table > tbody tr',
        );

        const findElement: HTMLElement = await new Promise(
          (resolve, reject) => {
            for (let i = 0; i < tableRows.length; i++) {
              const row = tableRows.item(i);

              const customerName = getTextBySelector(
                'td.ca-u-limit-text.ng-binding',
                row,
              );
              const monthlyValue = getTextBySelector(
                'td.ca-u-text-right.semi-bold-title.ng-binding',
                row,
              );
              const nextBillingDate = getTextBySelector('td:nth-child(3)', row);

              console.log(customerName, monthlyValue);

              const formattedMonthlyValue = Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })
                .format(evaluatedData.contract.monthly_value)
                .replace('R$', '')
                .trim();

              console.log(formattedMonthlyValue);

              if (
                customerName === evaluatedData.contract.customer_name &&
                monthlyValue === formattedMonthlyValue &&
                nextBillingDate === evaluatedData.formattedNextBillingDate
              ) {
                resolve(row);
                break;
              }
            }

            reject();
          },
        );

        console.log(findElement);

        if (findElement) {
          findElement.click();
        }
      },
      {
        contract,
        formattedNextBillingDate: format(
          contract.next_billing_date,
          'dd/MM/yyyy',
        ),
      },
    );

    await sleep(500);

    await this.page.driver.waitForSelector(
      '#conteudo > div:nth-child(1) > div:nth-child(2) > button',
    );

    await sleep(1000);
  }
}
