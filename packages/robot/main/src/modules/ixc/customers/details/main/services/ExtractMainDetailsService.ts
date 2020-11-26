import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import parseDate from '@utils/parseDate';
import removeCharacters from '@utils/removeCharacters';

import IMainDetailsIXC from '@modules/ixc/customers/details/main/models/IMainDetailsIXC';

interface IExtractedMainDetailsIXC
  extends Omit<IMainDetailsIXC, 'birth_date' | 'person_type'> {
  birth_date: string;
  document: string;
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
      const document_value = document.querySelector<HTMLInputElement>(
        '#cnpj_cpf',
      ).value;

      return {
        birth_date,
        document: document_value,
      };
    });

    const mainDetails: IMainDetailsIXC = {
      birth_date: parseDate(extractedMainDetails.birth_date),
      person_type:
        removeCharacters(extractedMainDetails.document).length === 14
          ? 'juridica'
          : 'fisica',
    };

    return mainDetails;
  }
}
