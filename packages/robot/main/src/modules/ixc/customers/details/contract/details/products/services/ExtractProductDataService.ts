import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import IContractProducts, {
  IContractProductItem,
} from '@modules/ixc/customers/details/contract/details/products/models/IContractProducts';

@injectable()
export default class ExtractProductDataService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IContractProducts> {
    const [
      findContractDetailsPageIdentifierElement,
    ] = await this.page.findElementsBySelector('#contrato');

    if (!findContractDetailsPageIdentifierElement) {
      throw new AppError(
        'You should be with the contract details window opened.',
      );
    }

    /* istanbul ignore next */
    const products = await this.page.evaluate<IContractProducts>(() => {
      const gross_value = getTextBySelector('form[id="3_form"] #tot_0');
      const net_value = getTextBySelector('form[id="3_form"] #tot_3');
      const items: IContractProductItem[] = [];

      const tableRows = document.querySelectorAll(
        '#cliente_contrato_view_vd_contratos_produtos_gen > tbody tr',
      );

      const parseValue = (value: string) =>
        Number(value.replace(/\./g, '').replace(',', '.'));

      tableRows.forEach(row => {
        const id = getTextBySelector('td:nth-child(1) > div', row);
        const description = getTextBySelector('td:nth-child(2) > div', row);
        const plan = getTextBySelector('td:nth-child(3) > div', row);
        const service = getTextBySelector('td:nth-child(4) > div', row);
        const amount = getTextBySelector('td:nth-child(5) > div', row);
        const unit_value = getTextBySelector('td:nth-child(6) > div', row);
        const product_gross_value = getTextBySelector(
          'td:nth-child(7) > div',
          row,
        );
        const product_net_value = getTextBySelector(
          'td:nth-child(11) > div',
          row,
        );
        const contract_id = getTextBySelector('td:nth-child(13) > div', row);

        const contractProductItem: IContractProductItem = {
          id,
          description,
          plan,
          service,
          amount: Number(amount),
          unit_value: parseValue(unit_value),
          gross_value: parseValue(product_gross_value),
          net_value: parseValue(product_net_value),
          contract_id,
        };

        items.push(contractProductItem);
      });

      return {
        gross_value: parseValue(gross_value),
        net_value: parseValue(net_value),
        items,
      };
    });

    return products;
  }
}
