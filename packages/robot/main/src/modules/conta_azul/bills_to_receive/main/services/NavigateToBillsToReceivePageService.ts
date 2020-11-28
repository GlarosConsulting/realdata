import { injectable, inject } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import contaAzulConfig from '@config/conta_azul';

import sleep from '@utils/sleep';

@injectable()
export default class NavigateToBillsToReceivePageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    await this.page.goTo(contaAzulConfig.pages.bills_to_receive.url);

    await this.page.driver.waitForSelector(
      '#addFinance > button.btn.btn-primary.primary-action',
    );

    await this.page.driver.waitForSelector('table > tbody > tr > td');

    await sleep(2000);

    /* istanbul ignore next */
    await this.page.evaluate(() => {
      document
        .querySelector<HTMLElement>(
          '#financeTopFilters > div.btn-group.min-margin.periodSelector > ul > li:nth-child(5) > a',
        )
        .click();
    });

    await this.page.driver.waitForSelector('table > tbody > tr > td');

    await sleep(2000);

    const [findFiltersButtonElement] = await this.page.findElementsBySelector(
      '#type-filter-controller',
    );

    await findFiltersButtonElement.click();

    await sleep(500);

    await this.page.driver.waitForSelector(
      '#type-filter > ul > li.tgt-all-children > a',
    );

    const [findAllFilterOptionElement] = await this.page.findElementsBySelector(
      '#type-filter > ul > li.tgt-all-children > a',
    );

    await findAllFilterOptionElement.click();

    await sleep(500);

    const [
      findExpiredFilterOptionElement,
    ] = await this.page.findElementsBySelector(
      '#typeFilterContainer > li.EXPIRED > a',
    );

    await findExpiredFilterOptionElement.click();

    await sleep(500);

    const [
      findOpenStatementsFilterOptionElement,
    ] = await this.page.findElementsBySelector(
      '#typeFilterContainer > li.OPENSTATEMENTS > a',
    );

    await findOpenStatementsFilterOptionElement.click();

    await sleep(500);

    const [
      findApplyFiltersButtonElements,
    ] = await this.page.findElementsBySelector(
      '#type-filter > ul > li.row.vertical-offset1 > div > button',
    );

    await findApplyFiltersButtonElements.click();

    await sleep(500);

    await this.page.driver.waitForSelector('table > tbody > tr > td');

    await sleep(1000);
  }
}
