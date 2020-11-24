import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';

import IMainDetailsIXC from '@modules/ixc/customers/details/main/models/IMainDetailsIXC';

interface IExtractedMainDetailsIXC extends Omit<IMainDetailsIXC, 'birth_date'> {
  birth_date: string;
}

@injectable()
export default class ExtractMainDetailsService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IMainDetailsIXC> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError('You should be with the customers window opened.');
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const extractedMainDetails = await this.page.evaluate<
      IExtractedMainDetailsIXC
    >(() => {
      const birth_date = document.querySelector<HTMLInputElement>(
        '#data_nascimento',
      ).value;

      return {
        birth_date,
      };
    });

    const mainDetails: IMainDetailsIXC = {
      ...extractedMainDetails,
      birth_date: parseDate(extractedMainDetails.birth_date),
    };

    return mainDetails;
  }
}
