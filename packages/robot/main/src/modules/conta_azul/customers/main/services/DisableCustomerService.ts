import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

interface IRequest {
  customer_name: string;
}

@injectable()
export default class DisableCustomerService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(
    { customer_name }: IRequest,
    dontSave = true,
  ): Promise<void> {
    const [findCustomersTitleElement] = await this.page.findElementsByText(
      ' Cadastro de clientes ',
      'h1',
    );

    if (!findCustomersTitleElement) {
      throw new AppError('You should be in customers page.');
    }

    const [findCustomerRowElement] = await this.page.findElementsByText(
      customer_name,
      '*[@id="gateway"]/section/div[2]/div[2]/div[2]/div/div/div[2]/div/div[1]/table/tbody/tr/td',
      '/..',
    );

    if (!findCustomerRowElement) {
      throw new AppError('Customer not found.');
    }

    const [findActionsButtonElement] = await findCustomerRowElement.$$(
      'td.ds-data-grid-tr__actions-td.ds-table-col.ds-u-text-align--right > div > div > div.ds-data-grid-actions__dropdown-container > div > div.ds-dropdown-toggle-container > button',
    );

    await findActionsButtonElement.click();

    await sleep(500);

    if (!dontSave) {
      const [findDisableButtonElement] = await this.page.findElementsBySelector(
        '#gateway > section > div.ds-container.ds-container--auto > div.ds-page > div.ds-row > div > div > div.ds-row.ds-data-grid__table-container > div > div > table > tbody > tr > td.ds-data-grid-tr__actions-td.ds-table-col.ds-u-text-align--right > div > div > div.ds-data-grid-actions__dropdown-container > div > div.ds-dropdown-menu > div:nth-child(5)',
      );

      await findDisableButtonElement.click();

      await sleep(1000);

      const [findConfirmButtonElement] = await this.page.findElementsBySelector(
        'body > div.ds-modal > div > div.ds-modal__body.has-footer > div.ds-footer.ds-modal-footer > div > button.ds-button.ds-button-primary.ds-button-md',
      );

      await findConfirmButtonElement.click();

      await sleep(1000);
    }
  }
}
