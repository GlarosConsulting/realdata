import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import ISaleProductItem from '@modules/ixc/customers/details/sales/details/products/models/ISaleProductItem';

@injectable()
export default class ExtractProductsListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<ISaleProductItem[]> {
    const [
      findSaleDetailsPageIdentifierElement,
    ] = await this.page.findElementsBySelector('#filial_id_label');

    if (!findSaleDetailsPageIdentifierElement) {
      throw new AppError('You should be with the sale details window opened.');
    }

    /* istanbul ignore next */
    const products = await this.page.evaluate<ISaleProductItem[]>(() => {
      const items: ISaleProductItem[] = [];

      const tableRows = document.querySelectorAll(
        '#vd_saida_vd_saida_produtos > tbody tr',
      );
      tableRows.forEach(row => {
        const id = getTextBySelector('td:nth-child(1) > div', row);
        const product = getTextBySelector('td:nth-child(2) > div', row);
        const description = getTextBySelector('td:nth-child(3) > div', row);
        const amount = getTextBySelector('td:nth-child(4) > div', row);
        const und = getTextBySelector('td:nth-child(5) > div', row);
        const currency = getTextBySelector('td:nth-child(6) > div', row);
        const unit_value = getTextBySelector('td:nth-child(7) > div', row);
        const discount = getTextBySelector('td:nth-child(8) > div', row);
        const increase = getTextBySelector('td:nth-child(9) > div', row);
        const discount_nfe = getTextBySelector('td:nth-child(10) > div', row);

        const contractProductItem: ISaleProductItem = {
          id,
          product,
          description,
          amount: Number(amount),
          und,
          currency,
          unit_value: Number(unit_value),
          discount: Number(discount),
          increase: Number(increase),
          discount_nfe: Number(discount_nfe),
        };

        items.push(contractProductItem);
      });

      return items;
    });

    return products;
  }
}
