import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

import IBillToReceive from '@modules/conta_azul/bills_to_receive/main/models/IBillToReceive';

import ExtractBillsToReceiveListService from './ExtractBillsToReceiveListService';

export const FIELDS = {
  'launch.customer_name': '#clienteFornecedorSearch',
};

interface IRequest {
  field: keyof typeof FIELDS;
  value: string;
}

@injectable()
export default class FindBillsToReceiveByFieldService {
  private extractCustomersList: ExtractBillsToReceiveListService;

  constructor(
    @inject('Page')
    private page: Page,
  ) {
    this.extractCustomersList = new ExtractBillsToReceiveListService(page);
  }

  public async execute({ field, value }: IRequest): Promise<IBillToReceive[]> {
    const [
      findBillsToPayIdentifierElement,
    ] = await this.page.findElementsBySelector(
      '#addFinance > button.btn.btn-primary.primary-action',
    );

    if (!findBillsToPayIdentifierElement) {
      throw new AppError('You should be in bills to pay page.');
    }

    await this.page.driver.waitForSelector(
      '#conteudo > div > div.menu-container > div.col-xs-9.no-padding.content-container > div > div.filter-header.no-margin-top.btn-toolbar > div.input-append.float-right > div > button',
    );

    await sleep(1000);

    const [
      findSearchFieldsDropdownElement,
    ] = await this.page.findElementsBySelector(
      '#conteudo > div > div.menu-container > div.col-xs-9.no-padding.content-container > div > div.filter-header.no-margin-top.btn-toolbar > div.input-append.float-right > div > button',
    );

    await findSearchFieldsDropdownElement.click();

    await this.page.driver.waitForSelector(FIELDS[field]);

    const [findInputElement] = await this.page.findElementsBySelector(
      FIELDS[field],
    );

    await this.page.typeToElement(findInputElement, value);

    await sleep(1000);

    await this.page.typeToElement(findInputElement, String.fromCharCode(13));

    await sleep(500);

    try {
      await this.page.driver.waitForSelector('table > tbody > tr > td');
    } catch {
      throw new AppError('Customer not found.');
    }

    await sleep(1000);

    const billsToPay = await this.extractCustomersList.execute();

    const billsToPayByCustomer = billsToPay.filter(customer => {
      if (field.includes('launch.')) {
        const launchField = field.split('.')[1];

        return customer['launch'][launchField] === value;
      }

      return customer[field] === value;
    });

    return billsToPayByCustomer;
  }
}
