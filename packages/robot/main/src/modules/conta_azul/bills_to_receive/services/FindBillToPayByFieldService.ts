import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

import ICustomerContaAzul from '@modules/conta_azul/customers/models/ICustomerContaAzul';

import ExtractBillsToPayListService from './ExtractBillsToPayListService';

const FIELDS = {
  document:
    '#gateway > section > div > div.ds-page > div > div > div > div.ds-row.ds-data-grid-header.ds-data-header-container > div > div > div.ds-col.ds-data-grid-header__filters-left.ds-col-6 > div > div.ds-dropdown-menu > div:nth-child(1) > span',
};

interface IRequest {
  field: keyof typeof FIELDS;
  value: string;
}

@injectable()
export default class FindCustomerByFieldService {
  private extractCustomersList: ExtractBillsToPayListService;

  constructor(
    @inject('Page')
    private page: Page,
  ) {
    this.extractCustomersList = new ExtractBillsToPayListService(page);
  }

  public async execute({
    field,
    value,
  }: IRequest): Promise<ICustomerContaAzul> {
    const [findCustomersTitleElement] = await this.page.findElementsBySelector(
      '#addFinance > button.btn.btn-primary.primary-action',
    );

    if (!findCustomersTitleElement) {
      throw new AppError('You should be in bills to pay page.');
    }

    const [
      findSearchFieldsDropdownElement,
    ] = await this.page.findElementsBySelector(
      '#conteudo > div > div.menu-container > div.col-xs-9.no-padding.content-container > div > div.filter-header.no-margin-top.btn-toolbar > div.input-append.float-right > div > button',
    );

    await findSearchFieldsDropdownElement.click();

    const [findInputElement] = await this.page.findElementsBySelector(
      '#clienteFornecedorSearch',
    );

    await this.page.typeToElement(findInputElement, value);

    await sleep(500);

    await this.page.typeToElement(findInputElement, String.fromCharCode(13));

    await sleep(500);

    try {
      await this.page.driver.waitForSelector(
        'body > div.ds-popover.ds-data-grid-advanced-filter-select-popover > div.ds-search-select.ds-multiple-select > div > div > div > div.ds-options__scrollable-options > div > div:nth-child(3)',
      );
    } catch {
      throw new AppError('Customer not found.');
    }

    const [findSelectCustomerElement] = await this.page.findElementsBySelector(
      'body > div.ds-popover.ds-data-grid-advanced-filter-select-popover > div.ds-search-select.ds-multiple-select > div > div > div > div.ds-options__scrollable-options > div > div:nth-child(3)',
    );

    await findSelectCustomerElement.click();

    const [findApplyButtonElement] = await this.page.findElementsBySelector(
      'body > div.ds-popover.ds-data-grid-advanced-filter-select-popover > div.ds-search-select.ds-multiple-select > div > div > div > div.ds-options__footer > div > div > button',
    );

    await findApplyButtonElement.click();

    await sleep(1000);

    const customers = await this.extractCustomersList.execute();

    const findCustomer = customers.find(customer => customer[field] === value);

    return findCustomer;
  }
}
