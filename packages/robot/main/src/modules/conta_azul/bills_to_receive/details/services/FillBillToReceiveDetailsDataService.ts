import { format, parseISO } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

interface IRequest {
  account: string;
  received_date: string;
  discount: number;
  interest: number;
  paid: number;
  transaction_id: string;
  sell_id: string;
}

@injectable()
export default class FillBillToReceiveDetailsDataService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(
    {
      account,
      received_date,
      discount,
      interest,
      paid,
      transaction_id,
      sell_id,
    }: IRequest,
    dontSave = true,
    close = true,
  ): Promise<void> {
    const [
      findBillsToPayDetailsIdentifierElement,
    ] = await this.page.findElementsBySelector('h3#newModalTitle');

    if (!findBillsToPayDetailsIdentifierElement) {
      throw new AppError(
        'You should be with bills to pay details modal opened.',
      );
    }

    /* istanbul ignore next */
    await this.page.evaluate(() => {
      document.querySelector<HTMLInputElement>('#newIdConta').value = '';
    });

    const [findAccountInputElement] = await this.page.findElementsBySelector(
      '#newIdConta',
    );

    await this.page.typeToElement(findAccountInputElement, account);

    await sleep(1000);

    await findAccountInputElement.press('Enter');

    await sleep(500);

    const [
      findReceivedCheckboxElement,
    ] = await this.page.findElementsBySelector(
      '#formStatement > div.casual-values.showing > div:nth-child(3) > div.act-now-show-in-simplified-conciliation > label:nth-child(4) > div > span.checkbox.baixado',
    );

    await findReceivedCheckboxElement.click();

    const [
      findReceivedDateDatePickerElement,
    ] = await this.page.findElementsBySelector('#dtBaixa');

    await this.page.typeToElement(
      findReceivedDateDatePickerElement,
      format(parseISO(received_date), 'dd/MM/yyyy'),
    );

    const [findDiscountInputElement] = await this.page.findElementsBySelector(
      '#discount',
    );

    await this.page.typeToElement(findDiscountInputElement, String(discount));

    const [findInterestInputElement] = await this.page.findElementsBySelector(
      '#interest',
    );

    await this.page.typeToElement(findInterestInputElement, String(interest));

    /* istanbul ignore next */
    await this.page.evaluate(value => {
      document.querySelector<HTMLInputElement>('#amountPaid').value = String(
        value,
      );
    }, paid);

    const [
      findObservationsInputElement,
    ] = await this.page.findElementsBySelector('#observacao');

    await this.page.typeToElement(
      findObservationsInputElement,
      `ID transação: ${transaction_id} e ID venda: ${sell_id}`,
    );

    await sleep(1000);

    if (!dontSave) {
      const [findSaveButtonElement] = await this.page.findElementsBySelector(
        '#finance-save-options > div.act-save > button.btn.save_form.btn-primary.addStatement',
      );

      await findSaveButtonElement.click();
    } else if (close) {
      const [findCloseButtonElement] = await this.page.findElementsBySelector(
        '#newPopupManagerReplacement > div.modal-header > button',
      );

      await findCloseButtonElement.click();
    }
  }
}
