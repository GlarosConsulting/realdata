import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';

import IFinanceIXC from '@modules/ixc/customers/details/finance/models/IFinanceIXC';

interface IExtractFinance
  extends Omit<
    IFinanceIXC,
    | 'emission_date'
    | 'due_date'
    | 'payment_date'
    | 'credit_date'
    | 'received_date'
  > {
  emission_date: string;
  due_date: string;
  payment_date: string;
  credit_date: string;
  received_date: string;
}

@injectable()
export default class ExtractFinanceListService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IFinanceIXC[]> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError('You should be with the customers window opened.');
    }

    const [findTableBodyElement] = await this.page.findElementsBySelector(
      '#grid_1 > tbody',
    );

    if (!findTableBodyElement) {
      return [];
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const extractedFinances = await this.page.evaluate<IExtractFinance[]>(
      () => {
        const data: IExtractFinance[] = [];

        const tableRows = document.querySelectorAll(
          'table#cliente_cliente_contrato_rel_areceber tbody tr',
        );

        tableRows.forEach(row => {
          const id = getTextBySelector('td[abbr="fn_areceber.id"] > div', row);
          const status = getTextBySelector(
            'td[abbr="fn_areceber.status"] > div > font',
            row,
          );
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

          const finance: IExtractFinance = {
            id,
            status,
            charge: Number(charge),
            contract_r: Number(contract_r),
            installment_r: Number(installment_r),
            contract_a: Number(contract_a),
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
          };

          data.push(finance);
        });

        return data;
      },
    );

    const finances = extractedFinances.map<IFinanceIXC>(finance => ({
      ...finance,
      emission_date: parseDate(finance.emission_date),
      due_date: parseDate(finance.due_date),
      payment_date: parseDate(finance.payment_date),
      credit_date: parseDate(finance.credit_date),
      received_date: parseDate(finance.received_date, 'dd/MM/yyyy HH:mm:ss'),
    }));

    return finances;
  }
}
