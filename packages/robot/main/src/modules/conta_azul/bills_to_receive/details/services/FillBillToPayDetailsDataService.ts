import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

interface IRequest {
  account: string;
}

@injectable()
export default class FillBillToPayDetailsDataService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute({ account }: IRequest): Promise<void> {
    const [
      findBillsToPayDetailsIdentifierElement,
    ] = await this.page.findElementsBySelector('h3#newModalTitle');

    if (!findBillsToPayDetailsIdentifierElement) {
      throw new AppError(
        'You should be with bills to pay details modal opened.',
      );
    }

    const [findAccountInputElement] = await this.page.findElementsBySelector(
      '#newIdConta',
    );

    await findAccountInputElement.click();

    await sleep(500);

    await findAccountInputElement.type(account);

    await sleep(1000);

    await this.page.typeToElement(
      findAccountInputElement,
      String.fromCharCode(13),
    );
  }
}
