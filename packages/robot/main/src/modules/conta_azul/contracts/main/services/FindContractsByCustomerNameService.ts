import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

import IContractContaAzul from '@modules/conta_azul/contracts/main/models/IContractContaAzul';

import ExtractContractsListService from './ExtractContractsListService';

interface IRequest {
  name: string;
}

@injectable()
export default class FindContractsByCustomerNameService {
  private extractContractsList: ExtractContractsListService;

  constructor(
    @inject('Page')
    private page: Page,
  ) {
    this.extractContractsList = new ExtractContractsListService(page);
  }

  public async execute({ name }: IRequest): Promise<IContractContaAzul[]> {
    const [
      findCreateContractButtonElement,
    ] = await this.page.findElementsBySelector(
      '#conteudo > div.row.ca-u-margin-top.ng-scope > div > div > div.col-xs-2 > button',
    );

    if (!findCreateContractButtonElement) {
      throw new AppError('You should be in contracts page.');
    }

    const [findInputElement] = await this.page.findElementsBySelector(
      '#conteudo > div.row.ca-u-margin-top.ng-scope > div > div > div.col-xs-4.col-xs-offset-6 > div > input',
    );

    await this.page.typeToElement(findInputElement, name);

    await sleep(500);

    await this.page.typeToElement(findInputElement, String.fromCharCode(13));

    await sleep(500);

    try {
      await this.page.driver.waitForSelector('#conteudo > table > tbody > tr');
    } catch {
      return null;
    }

    await sleep(1000);

    const contracts = await this.extractContractsList.execute();

    return contracts;
  }
}
