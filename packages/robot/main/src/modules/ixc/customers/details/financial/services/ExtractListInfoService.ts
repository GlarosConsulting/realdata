import { injectable, inject } from 'tsyringe';

import AppError from '@robot/shared/errors/AppError';
import injectFunctions from '@robot/shared/modules/browser/infra/puppeteer/inject';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

export interface IResponse {
  pages: {
    current: number;
    total: number;
  };
}

@injectable()
export default class ExtractListInfoService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<IResponse> {
    const [
      findCustomersWindowTitleElement,
    ] = await this.page.findElementsByText('Cliente', 'div[@class="ftitle"]');

    if (!findCustomersWindowTitleElement) {
      throw new AppError(
        'You should be with the customers window opened in financial tab.',
      );
    }

    await injectFunctions(this.page);

    /* istanbul ignore next */
    const pagesText = await this.page.evaluate(() =>
      getTextBySelector(
        'div.panel.mostrando > dl > div > div > div.tDiv.bg2 > div.tDiv2 > span.pPageStat',
      ),
    );

    const pagesTextSplit = pagesText.split(' ');

    const listShowingItems = Number(pagesTextSplit[2]);
    const listTotalItems = Number(pagesTextSplit[4]);

    const currentPage = Math.floor(listTotalItems / listShowingItems);
    const totalPages = Math.ceil(listTotalItems / 17);

    return {
      pages: {
        current: listShowingItems !== listTotalItems ? currentPage : totalPages,
        total: totalPages,
      },
    };
  }
}
