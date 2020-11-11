import { injectable, inject } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

@injectable()
export default class NavigateToCustomersPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    const [
      findRegistersDropdownButtonMenuElement,
    ] = await this.page.findElementsBySelector(
      '#menu04400d48d04acd3599cf545dafbb90ed > div > a',
    );

    await findRegistersDropdownButtonMenuElement.click();

    const [findCustomersButtonMenuElement] = await this.page.findElementsByText(
      'Clientes',
      "a[@rel=\"cria_grid('#1_grid','cliente','N');\"]",
    );

    await findCustomersButtonMenuElement.click();

    await this.page.waitForElementsWithText('Cliente', 'div[@class="ftitle"]');
  }
}
