import { format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

interface IRequest {
  account: string;
  received_date: Date;
  discount: number;
  interest: number;
  value?: number;
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
      value,
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

    await this.page.driver.waitForSelector('#idClienteFornecedor');

    await sleep(1000);

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

    await sleep(1000);

    if (value !== undefined) {
      /* istanbul ignore next */
      await this.page.evaluate(evaluatedValue => {
        document.querySelector<HTMLInputElement>('#valor').value = String(
          evaluatedValue,
        ).replace('.', ',');
      }, value);

      await sleep(1000);
    }

    const [
      findReceivedCheckboxElement,
    ] = await this.page.findElementsBySelector(
      '#formStatement > div.casual-values.showing > div:nth-child(3) > div.act-now-show-in-simplified-conciliation > label:nth-child(4) > div > span.checkbox.baixado',
    );

    await findReceivedCheckboxElement.click();

    await sleep(1000);

    /* istanbul ignore next */
    await this.page.evaluate(formattedDate => {
      document.querySelector<HTMLInputElement>(
        '#dtBaixa',
      ).value = formattedDate;
    }, format(received_date, 'dd/MM/yyyy'));
    await sleep(1000);

    const [findDiscountInputElement] = await this.page.findElementsBySelector(
      '#discount',
    );

    await this.page.typeToElement(
      findDiscountInputElement,
      String(discount).replace('.', ','),
    );

    await sleep(500);

    const [findInterestInputElement] = await this.page.findElementsBySelector(
      '#interest',
    );

    await this.page.typeToElement(
      findInterestInputElement,
      String(interest).replace('.', ','),
    );

    await sleep(500);

    /* istanbul ignore next */
    await this.page.evaluate(amountPaid => {
      document.querySelector<HTMLInputElement>('#amountPaid').value = String(
        amountPaid,
      ).replace('.', ',');
    }, paid);

    await sleep(500);

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

      await sleep(500);

      const [
        findInvalidDateWarningOkButtonElement,
      ] = await this.page.findElementsBySelector(
        '#alertDialog > div.btn-toolbar.no-margin-top.margin-bottom.Footer > ul > li > button',
      );

      if (findInvalidDateWarningOkButtonElement) {
        console.log();
        console.log('INVALID DATE WARNING');
        console.log();

        await findInvalidDateWarningOkButtonElement.click();

        const [
          findReceivedDateDatePickerElement2,
        ] = await this.page.findElementsBySelector('#dtBaixa');

        await this.page.typeToElement(
          findReceivedDateDatePickerElement2,
          format(received_date, 'dd/MM/yyyy'),
        );

        await sleep(500);

        await this.page.typeToElement(
          findReceivedDateDatePickerElement2,
          String.fromCharCode(13),
        );

        const [
          findCloseButtonElement2,
        ] = await this.page.findElementsBySelector(
          '#newPopupManagerReplacement > div.modal-header > button',
        );

        await findCloseButtonElement2.click();
      }
    }

    await sleep(2000);
  }
}
