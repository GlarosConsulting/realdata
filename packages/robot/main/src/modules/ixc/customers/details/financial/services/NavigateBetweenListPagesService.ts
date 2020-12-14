import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

export interface IRequest {
  to: 'previous' | 'next';
}

@injectable()
export default class NavigateBetweenListPagesService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute({ to }: IRequest): Promise<void> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError(
        'You should be with the customers window opened in financial tab.',
      );
    }

    if (to === 'previous') {
      const [
        findNavigateToPreviousPageButtonElement,
      ] = await this.page.findElementsBySelector(
        'div.panel.mostrando > dl > div > div > div.tDiv.bg2 > div.tDiv2 > span.pPageButtons > i.fa.fa-backward',
      );

      await findNavigateToPreviousPageButtonElement.click();
    } else if (to === 'next') {
      const [
        findNavigateToNextPageButtonElement,
      ] = await this.page.findElementsBySelector(
        'div.panel.mostrando > dl > div > div > div.tDiv.bg2 > div.tDiv2 > span.pPageButtons > i.fa.fa-forward',
      );

      await findNavigateToNextPageButtonElement.click();
    }

    await sleep(500);
  }
}
