import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';
import sleep from '@utils/sleep';

import IContractIXC from '@modules/ixc/customers/details/contract/models/IContractIXC';
import IContractProducts, {
  IContractProductItem,
} from '@modules/ixc/customers/details/contract/models/IContractProducts';

interface IExtractContract
  extends Omit<IContractIXC, 'activation_date' | 'base_date'> {
  activation_date: string;
  base_date: string;
}

interface IExtractContractProducts
  extends Omit<IContractProducts, 'gross_value' | 'net_value'> {
  gross_value: string;
  net_value: string;
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
            products: {
              gross_value: 0,
              net_value: 0,
              items: [],
            },
          };

          data.push(contract);
        });

        return data;
      },
    );

    for (const contract of extractedContracts) {
      /* istanbul ignore next */
      await this.page.evaluate(contractId => {
        const element = document.evaluate(
          `//td[@abbr="cliente_contrato.id"]/div[contains(text(), '${contractId}')]/../..`,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null,
        ).singleNodeValue;

        const clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('dblclick', true, true);

        element.dispatchEvent(clickEvent);
      }, contract.id);

      await this.page.driver.waitForSelector('#contrato');

      await sleep(1000);

      const [findProductsTabElement] = await this.page.findElementsBySelector(
        'form[id="3_form"] div.abas.clearfix > ul > li:nth-child(6) > a',
      );

      await findProductsTabElement.click();

      await sleep(1000);

      /* istanbul ignore next */
      const products = await this.page.evaluate<IContractProducts>(() => {
        const gross_value = getTextBySelector('form[id="3_form"] #tot_0');
        const net_value = getTextBySelector('form[id="3_form"] #tot_3');
        const items: IContractProductItem[] = [];

        const tableRows = document.querySelectorAll(
          '#cliente_contrato_view_vd_contratos_produtos_gen > tbody tr',
        );

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
            unit_value: Number(unit_value.replace(/\./g, '').replace(',', '.')),
            gross_value: Number(
              product_gross_value.replace(/\./g, '').replace(',', '.'),
            ),
            net_value: Number(
              product_net_value.replace(/\./g, '').replace(',', '.'),
            ),
            contract_id,
          };

          items.push(contractProductItem);
        });

        document
          .querySelector<HTMLElement>(
            'form[id="3_form"] div.mDiv > div.btn_row > a.fa.fa-times',
          )
          .click();

        return {
          gross_value: Number(gross_value.replace(/\./g, '').replace(',', '.')),
          net_value: Number(net_value.replace(/\./g, '').replace(',', '.')),
          items,
        };
      });

      contract.products = products;
    }

    const contracts = extractedContracts.map<IContractIXC>(contract => ({
      ...contract,
      activation_date: parseDate(contract.activation_date),
      base_date: parseDate(contract.activation_date),
    }));

    return contracts;
  }
}
