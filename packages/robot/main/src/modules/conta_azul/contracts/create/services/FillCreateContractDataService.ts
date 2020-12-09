import { format, parseISO } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import removeCharacters from '@utils/removeCharacters';
import sleep from '@utils/sleep';

import IContractProductItemContaAzul from '@modules/conta_azul/contracts/create/models/IContractProductItemContaAzul';

interface IRequest {
  name: string;
  document: string;
  category: string;
  sell_date: string;
  always_charge_on_day: number;
  products: IContractProductItemContaAzul[];
  ixc_contract_id: string;
}

@injectable()
export default class FillCreateContractDataService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(
    {
      name,
      document: document_value,
      category,
      sell_date,
      always_charge_on_day: original_always_charge_on_day,
      products,
      ixc_contract_id,
    }: IRequest,
    dontSave = true,
  ): Promise<void> {
    let always_charge_on_day = original_always_charge_on_day;

    if (always_charge_on_day) {
      always_charge_on_day = 29;
    }

    const [
      findCreateContractIdentifierElement,
    ] = await this.page.findElementsBySelector(
      '#negotiation > form > div > ng-transclude > div > div:nth-child(4) > div.col-xs-offset-1.col-xs-3.ng-scope > ca-field > div > ng-transclude > caf-customer-search-select > div > ca-search-select > div > ca-select > div > button',
    );

    if (!findCreateContractIdentifierElement) {
      throw new AppError('You should be in create contract page.');
    }

    const [findCustomerButtonElement] = await this.page.findElementsBySelector(
      '#negotiation > form > div > ng-transclude > div > div:nth-child(4) > div.col-xs-offset-1.col-xs-3.ng-scope > ca-field > div > ng-transclude > caf-customer-search-select > div > ca-search-select > div > ca-select > div > button',
    );

    await findCustomerButtonElement.click();

    const [findCustomerInputElement] = await this.page.findElementsBySelector(
      '#negotiation > form > div > ng-transclude > div > div:nth-child(4) > div.col-xs-offset-1.col-xs-3.ng-scope > ca-field > div > ng-transclude > caf-customer-search-select > div > ca-search-select > div > ca-select > div > div > div > ca-search-select-input > span > ca-input > div > span > input',
    );

    await this.page.typeToElement(findCustomerInputElement, name);

    await sleep(2000);

    const [findCustomerSelectElement] = await this.page.findElementsByText(
      `: ${removeCharacters(document_value)}`,
      'ng-transclude/ca-row/ng-transclude/ca-col/ng-transclude/span',
    );

    await findCustomerSelectElement.click();

    const [findCategoryButtonElement] = await this.page.findElementsBySelector(
      '#negotiation > form > div > ng-transclude > div > div:nth-child(4) > div:nth-child(3) > ca-field > div > ng-transclude > caf-category-search-select > div > ca-search-select > div > ca-select > div > button',
    );

    await findCategoryButtonElement.click();

    const [findCategoryInputElement] = await this.page.findElementsBySelector(
      '#negotiation > form > div > ng-transclude > div > div:nth-child(4) > div:nth-child(3) > ca-field > div > ng-transclude > caf-category-search-select > div > ca-search-select > div > ca-select > div > div > div > ca-search-select-input > span > ca-input > div > span > input',
    );

    await this.page.typeToElement(findCategoryInputElement, category);

    await sleep(1000);

    const [findCategorySelectElement] = await this.page.findElementsByText(
      category,
      'ng-transclude/ca-row/ng-transclude/ca-col/ng-transclude/span',
    );

    await sleep(1000);

    await findCategorySelectElement.click();

    /* istanbul ignore next */
    await this.page.evaluate(() => {
      document.querySelector<HTMLInputElement>('#negotiationEmission').value =
        '';
    });

    const [findSellDateInputElement] = await this.page.findElementsBySelector(
      '#negotiationEmission',
    );

    await this.page.typeToElement(
      findSellDateInputElement,
      format(parseISO(sell_date), 'dd/MM/yyyy'),
    );

    await this.page.select(
      'select[ng-model="negotiation.data.schedule.expirationType"]',
      'string:FOREVER',
    );

    await this.page.select(
      '#contractStartDate',
      `number:${always_charge_on_day}`,
    );

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

      await this.page.typeToElement(findProductNameInputElement, product.name);
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

    const [
      findDescriptionTextareaElement,
    ] = await this.page.findElementsBySelector('#negotiationNote');

    await this.page.typeToElement(
      findDescriptionTextareaElement,
      `ID Contrato IXC: ${ixc_contract_id}`,
    );

    await sleep(1000);

    if (!dontSave) {
      const [findSaveButtonElement] = await this.page.findElementsBySelector(
        '#saveNegotiation',
      );

      await findSaveButtonElement.click();

      await sleep(2000);

      await this.page.driver.waitForSelector(
        '#conteudo > div:nth-child(2) > div:nth-child(3) > div.col-xs-6 > permission-based-link > ca-link > span > ca-button > button > ng-transclude > ng-transclude > span > span',
      );
    }
  }
}
