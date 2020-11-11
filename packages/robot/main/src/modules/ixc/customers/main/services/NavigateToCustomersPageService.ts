import { injectable, inject } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

@injectable()
export default class NavigateToCustomersPageService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute(): Promise<void> {
    await this.page.driver.waitForSelector(
      '#menu04400d48d04acd3599cf545dafbb90ed > div > a',
    );

    const [
      findRegistersDropdownButtonMenuElement,
    ] = await this.page.findElementsBySelector(
      '#menu04400d48d04acd3599cf545dafbb90ed > div > a',
    );

    await findRegistersDropdownButtonMenuElement.click();

    const [findCustomersButtonMenuElement] = await this.page.findElementsByText(
      'Clientes',
      'a',
    );

    await findCustomersButtonMenuElement.click();

    await this.page.driver.waitForSelector(
      'body div.modal2 div.mDiv div.ftitle',
    );
  }
}
