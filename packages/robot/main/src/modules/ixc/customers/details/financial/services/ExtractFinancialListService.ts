import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';

import IFinancialItemIXC from '@modules/ixc/customers/details/financial/models/IFinancialItemIXC';

import ExtractListInfoService from './ExtractListInfoService';
import NavigateBetweenListPagesService from './NavigateBetweenListPagesService';

export interface IExtractFinancialIXC
  extends Omit<
    IFinancialItemIXC,
    | 'emission_date'
    | 'due_date'
    | 'payment_date'
    | 'credit_date'
    | 'received_date'
    | 'cancellation_date'
  > {
  emission_date: string;
  due_date: string;
  payment_date: string;
  credit_date: string;
  received_date: string;
  cancellation_date: string;
}

@injectable()
export default class ExtractFinancialListService {
  private extractListInfo: ExtractListInfoService;

  private navigateBetweenListPages: NavigateBetweenListPagesService;

  constructor(
    @inject('Page')
    private page: Page,
  ) {
    this.extractListInfo = new ExtractListInfoService(page);
    this.navigateBetweenListPages = new NavigateBetweenListPagesService(page);
  }

  public async execute(): Promise<IFinancialItemIXC[]> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError(
        'You should be with the customers window opened in financial tab.',
      );
    }

    const [findTableBodyElement] = await this.page.findElementsBySelector(
      '#grid_1 > tbody',
    );

    if (!findTableBodyElement) {
      return [];
    }

    await injectFunctions(this.page);

    const extractedFinancial: IExtractFinancialIXC[] = [];

    let listInfo = await this.extractListInfo.execute();

    for (let i = listInfo.pages.current; i <= listInfo.pages.total; i++) {
      /* istanbul ignore next */
      const newExtractedFinancial = await this.page.evaluate<
        IExtractFinancialIXC[]
      >(() => {
        const data: IExtractFinancialIXC[] = [];

        const tableRows = document.querySelectorAll(
          'table#cliente_cliente_contrato_rel_areceber tbody tr',
        );

        tableRows.forEach(row => {
          const id = getTextBySelector('td[abbr="fn_areceber.id"] > div', row);
          const status = getTextBySelector('td:nth-child(2) > div', row);
          const charge = getTextBySelector(
            'td[abbr="fn_areceber.id_carteira_cobranca"] > div',
            row,
          );
          const contract_r = getTextBySelector(
            'td[abbr="fn_areceber.id_contrato"] > div',
            row,
          );
          const installment_r = getTextBySelector(
            'td[abbr="fn_areceber.numero_parcela_recorrente"] > div',
            row,
          );
          const contract_a = getTextBySelector(
            'td[abbr="fn_areceber.id_contrato_avulso"] > div',
            row,
          );
          const sell_id = getTextBySelector(
            'td[abbr="fn_areceber.id_saida"] > div',
            row,
          );
          const emission_date = getTextBySelector(
            'td[abbr="fn_areceber.data_emissao"] > div',
            row,
          );
          const due_date = getTextBySelector(
            'td[abbr="fn_areceber.data_vencimento"] > div',
            row,
          );
          const value = getTextBySelector(
            'td[abbr="fn_areceber.valor"] > div',
            row,
          );
          const received_value = getTextBySelector(
            'td[abbr="fn_areceber.valor_recebido"] > div',
            row,
          );
          const open_value = getTextBySelector(
            'td[abbr="fn_areceber.valor_aberto"] > div',
            row,
          );
          const paid_value = getTextBySelector(
            'td[abbr="fn_areceber.pagamento_valor"] > div',
            row,
          );
          const payment_date = getTextBySelector(
            'td[abbr="fn_areceber.pagamento_data"] > div',
            row,
          );
          const credit_date = getTextBySelector(
            'td[abbr="fn_areceber.credito_data"] > div',
            row,
          );
          const received_date = getTextBySelector(
            'td[abbr="fn_areceber.baixa_data"] > div',
            row,
          );
          const type = getTextBySelector(
            'td[abbr="fn_areceber.tipo_recebimento"] > div',
            row,
          );
          const cancellation_date = getTextBySelector(
            'td:nth-child(19) > div',
            row,
          );
          const cancellation_reason = getTextBySelector(
            'td:nth-child(20) > div',
            row,
          );

          console.log(status);

          const financial: IExtractFinancialIXC = {
            id,
            status,
            charge: Number(charge),
            contract_r,
            installment_r: Number(installment_r),
            contract_a,
            sell_id,
            emission_date,
            due_date,
            value: Number(value.replace(',', '.')),
            received_value: Number(received_value.replace(',', '.')),
            open_value: Number(open_value.replace(',', '.')),
            paid_value: Number(paid_value.replace(',', '.')),
            payment_date,
            credit_date,
            received_date,
            type,
            cancellation_date,
            cancellation_reason,
          };

          data.push(financial);
        });

        return data;
      });

      extractedFinancial.push(...newExtractedFinancial);

      if (i < listInfo.pages.total) {
        await this.navigateBetweenListPages.execute({ to: 'next' });

        listInfo = await this.extractListInfo.execute();
      }
    }

    const financial = extractedFinancial.map<IFinancialItemIXC>(item => ({
      ...item,
      emission_date: parseDate(item.emission_date),
      due_date: parseDate(item.due_date),
      payment_date: parseDate(item.payment_date),
      credit_date: parseDate(item.credit_date),
      received_date: parseDate(item.received_date, 'dd/MM/yyyy HH:mm:ss'),
      cancellation_date: parseDate(item.cancellation_date, 'dd/MM/yyyy'),
    }));

    return financial;
  }
}
