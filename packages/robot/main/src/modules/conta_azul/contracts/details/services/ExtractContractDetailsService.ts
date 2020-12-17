import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';
import sleep from '@utils/sleep';

import IContractProductItemContaAzul from '@modules/conta_azul/contracts/create/models/IContractProductItemContaAzul';
import IContractDetailsContaAzul from '@modules/conta_azul/contracts/details/models/IContractDetailsContaAzul';

interface IExtractContractDetailsContaAzul
  extends Omit<IContractDetailsContaAzul, 'start_date' | 'next_billing_date'> {
  start_date: string;
  next_billing_date: string;
}

@injectable()
export default class ExtractContractDetailsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IContractDetailsContaAzul> {
    const [
      findContractDetailsPageIdentifierElement,
    ] = await this.page.findElementsBySelector(
      '#conteudo > div:nth-child(1) > div:nth-child(2) > button',
    );

    if (!findContractDetailsPageIdentifierElement) {
      throw new AppError('You should be in contract details page.');
    }

    await sleep(500);

    const pageUrl = await this.page.driver.url();

    const splitPageUrl = pageUrl.split('/');

    const id = splitPageUrl[splitPageUrl.length - 1];

    await sleep(500);

    /* istanbul ignore next */
    const extractedContractDetails = await this.page.evaluate<
      IExtractContractDetailsContaAzul
    >(() => {
      const start_date = getTextBySelector(
        '#conteudo > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > span',
      );
      const next_billing_date = getTextBySelector(
        '#conteudo > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > span',
      );
      const frequency = getTextBySelector(
        '#conteudo > div:nth-child(2) > div:nth-child(4) > div:nth-child(1) > span',
      );
      const charging = getTextBySelector(
        '#conteudo > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > span',
      );
      const remaining_validity = getTextBySelector(
        '#conteudo > div:nth-child(2) > div:nth-child(4) > div:nth-child(3) > span',
      );

      const products: IContractProductItemContaAzul[] = [];

      const productTableRows = document.querySelectorAll<HTMLElement>(
        '#conteudo > div:nth-child(2) > div.row.ca-u-vertical-offset5 > div > table > tbody > tr',
      );

      productTableRows.forEach(row => {
        const product_name = getTextBySelector('td:nth-child(1)', row);
        const product_description = getTextBySelector('td:nth-child(2)', row);
        const product_amount = getTextBySelector('td:nth-child(3)', row);
        const product_unit_value = getTextBySelector('td:nth-child(4)', row);

        const product: IContractProductItemContaAzul = {
          name: product_name,
          description: product_description,
          amount: Number(product_amount),
          unit_value: Number(
            product_unit_value.replace(/\./g, '').replace(',', '.'),
          ),
        };

        products.push(product);
      });

      return {
        start_date,
        next_billing_date,
        frequency,
        charging,
        remaining_validity,
        products,
      } as IExtractContractDetailsContaAzul;
    });

    await sleep(1000);

    const [findEditButtonElement] = await this.page.findElementsBySelector(
      '#conteudo > div:nth-child(1) > div:nth-child(2) > button',
    );

    await this.page.clickForNavigate(findEditButtonElement);

    await sleep(2000);

    await this.page.driver.waitForSelector('#negotiationNote');

    /* istanbul ignore next */
    const description = await this.page.evaluate<string>(
      () =>
        document.querySelector<HTMLTextAreaElement>('#negotiationNote').value,
    );

    await sleep(1000);

    await this.page.driver.goBack();

    await sleep(1000);

    const contractDetails: IContractDetailsContaAzul = {
      ...extractedContractDetails,
      id,
      description,
      start_date: parseDate(extractedContractDetails.start_date),
      next_billing_date: parseDate(extractedContractDetails.next_billing_date),
    };

    return contractDetails;
  }
}
