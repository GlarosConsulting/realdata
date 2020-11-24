import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

import ICustomerContaAzul from '@modules/conta_azul/customers/main/models/ICustomerContaAzul';

import ExtractCustomersListService from './ExtractCustomersListService';

export const FIELDS = {
  document:
    '#gateway > section > div > div.ds-page > div > div > div > div.ds-row.ds-data-grid-header.ds-data-header-container > div > div > div.ds-col.ds-data-grid-header__filters-left.ds-col-6 > div > div.ds-dropdown-menu > div:nth-child(1) > span',
};

interface IRequest {
  field: keyof typeof FIELDS;
  value: string;
}

@injectable()
export default class FindCustomerByFieldService {
  private extractCustomersList: ExtractCustomersListService;

  constructor(
    @inject('Page')
    private page: Page,
  ) {
    this.extractCustomersList = new ExtractCustomersListService(page);
  }

  public async execute({
    field,
    value,
  }: IRequest): Promise<ICustomerContaAzul> {
    const [findCustomersTitleElement] = await this.page.findElementsByText(
      ' Cadastro de clientes ',
      'h1',
    );

    if (!findCustomersTitleElement) {
      throw new AppError('You should be in customers page.');
    }

    /* istanbul ignore next */
    await this.page.evaluate(selector => {
      document.querySelector<HTMLElement>(selector).click();
    }, FIELDS[field]);

    const [findInputElement] = await this.page.findElementsBySelector(
      'body > div.ds-popover.ds-data-grid-advanced-filter-select-popover > div.ds-search-select.ds-multiple-select > div > div > div > div.ds-options__header > span > div > input',
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
      return null;
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
