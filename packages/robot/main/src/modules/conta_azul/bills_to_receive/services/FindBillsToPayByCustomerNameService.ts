import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

import IBillToPay from '@modules/conta_azul/bills_to_receive/models/IBillToPay';

import ExtractBillsToPayListService from './ExtractBillsToPayListService';

interface IRequest {
  customer_name: string;
}

@injectable()
export default class FindBillToPayByCustomerNameService {
  private extractCustomersList: ExtractBillsToPayListService;

  constructor(
    @inject('Page')
    private page: Page,
  ) {
    this.extractCustomersList = new ExtractBillsToPayListService(page);
  }

  public async execute({ customer_name }: IRequest): Promise<IBillToPay[]> {
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

    await this.page.typeToElement(findInputElement, customer_name);

    await sleep(500);

    await this.page.typeToElement(findInputElement, String.fromCharCode(13));

    await sleep(500);

    try {
      await this.page.driver.waitForSelector('table > tbody > tr > td');
    } catch {
      throw new AppError('Customer not found.');
    }

    await sleep(1000);

    const billsToPay = await this.extractCustomersList.execute();

    const billsToPayByCustomer = billsToPay.filter(
      customer => customer.launch.customer_name === customer_name,
    );

    return billsToPayByCustomer;
  }
}
