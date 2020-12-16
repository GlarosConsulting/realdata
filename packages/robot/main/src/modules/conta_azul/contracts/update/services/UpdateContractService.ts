import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

import IContractProductItemContaAzul from '@modules/conta_azul/contracts/create/models/IContractProductItemContaAzul';

interface IRequest {
  products?: IContractProductItemContaAzul[];
  description?: string;
}

@injectable()
export default class UpdateContractService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(
    { products, description }: IRequest,
    dontSave = true,
  ): Promise<void> {
    const [
      findUpdateContractPageIdentifierElement,
    ] = await this.page.findElementsBySelector(
      '#negotiation > form > div > ng-transclude > div > div:nth-child(4) > div.col-xs-offset-1.col-xs-3.ng-scope > ca-field > div > ng-transclude > caf-customer-search-select > div > ca-search-select > div > ca-select > div > button',
    );

    if (!findUpdateContractPageIdentifierElement) {
      throw new AppError('You should be in update contract page.');
    }

    if (products) {
      this.page.driver.on('dialog', async dialog => {
        await sleep(1000);

        dialog.accept();

        await sleep(1000);
      });

      const findRemoveProductButtonElements = await this.page.findElementsBySelector(
        '#negotiation > form > div > ng-transclude > div > div:nth-child(7) > div > div.col-xs-10.col-xs-offset-1 > table > tbody tr td:nth-child(6)',
      );

      for (const removeProductButton of findRemoveProductButtonElements) {
        await removeProductButton.click();

        await sleep(500);
      }

      let findProductRowsElements = await this.page.findElementsBySelector(
        '#negotiation > form > div > ng-transclude > div > div:nth-child(7) > div > div.col-xs-10.col-xs-offset-1 > table > tbody > tr',
      );

      const [
        findAddNewProductRowElement,
      ] = await this.page.findElementsBySelector('#newNegotiationItem');

      for (let i = findProductRowsElements.length; i < products.length; i++) {
        await findAddNewProductRowElement.click();
      }

      findProductRowsElements = await this.page.findElementsBySelector(
        '#negotiation > form > div > ng-transclude > div > div:nth-child(7) > div > div.col-xs-10.col-xs-offset-1 > table > tbody > tr',
      );

      for (let i = 0; i < products.length; i++) {
        const row = findProductRowsElements[i];
        const product = products[i];

        const [findProductNameInputElement] = await row.$$(
          'td:nth-child(1) > input:nth-child(3)',
        );

        await this.page.typeToElement(
          findProductNameInputElement,
          product.name,
        );
        await sleep(1000);
        await findProductNameInputElement.press('Enter');

        const [findProductDescriptionInputElement] = await row.$$(
          'td:nth-child(2) > textarea',
        );

        await this.page.typeToElement(
          findProductDescriptionInputElement,
          product.description,
        );

        /* istanbul ignore next */
        await this.page.evaluate(rowIndex => {
          const rows = document.querySelectorAll(
            '#negotiation > form > div > ng-transclude > div > div:nth-child(7) > div > div.col-xs-10.col-xs-offset-1 > table > tbody > tr',
          );

          rows[rowIndex].querySelector<HTMLInputElement>(
            'td:nth-child(3) > input',
          ).value = '';

          rows[rowIndex].querySelector<HTMLInputElement>(
            'td:nth-child(4) > span > input',
          ).value = '';
        }, i);

        const [findProductAmountInputElement] = await row.$$(
          'td:nth-child(3) > input',
        );

        await this.page.typeToElement(
          findProductAmountInputElement,
          String(product.amount),
        );

        const [findProductUnitValueInputElement] = await row.$$(
          'td:nth-child(4) > span > input',
        );

        await this.page.typeToElement(
          findProductUnitValueInputElement,
          String(product.unit_value).replace('.', ','),
        );
      }
    }

    if (description) {
      /* istanbul ignore next */
      await this.page.evaluate(() => {
        document.querySelector<HTMLTextAreaElement>('#negotiationNote').value =
          '';
      });

      await sleep(500);

      const [
        findDescriptionTextareaElement,
      ] = await this.page.findElementsBySelector('#negotiationNote');

      await this.page.typeToElement(
        findDescriptionTextareaElement,
        description,
      );

      await sleep(500);
    }

    if (!dontSave) {
      const [findSaveButtonElement] = await this.page.findElementsBySelector(
        '#saveNegotiation',
      );

      await findSaveButtonElement.click();

      await sleep(1000);

      const [
        findUpcomingPurchasesRadioElement,
      ] = await this.page.findElementsBySelector(
        '#newPopupManagerReplacement > div > div.modal-body > div > ul > li:nth-child(2) > label',
      );

      await findUpcomingPurchasesRadioElement.click();

      const [
        findConfirmEditButtonElement,
      ] = await this.page.findElementsBySelector('#editRecurrency');

      await findConfirmEditButtonElement.click();
    }

    await sleep(2000);

    await this.page.driver.waitForSelector(
      '#conteudo > div:nth-child(2) > div:nth-child(3) > div.col-xs-6 > permission-based-link > ca-link > span > ca-button > button > ng-transclude > ng-transclude > span > span',
    );
  }
}
