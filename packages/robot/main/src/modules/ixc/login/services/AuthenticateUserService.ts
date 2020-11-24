import { injectable, inject } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

import sleep from '@utils/sleep';

interface IRequest {
  email: string;
  password: string;
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('Page')
    private page: Page,
  ) {}

  public async execute({ email, password }: IRequest): Promise<boolean> {
    await this.page.type('input[name="email"]', email);
    await this.page.type('input[name="senha"]', password);

    const [findLogInButtonElement] = await this.page.findElementsBySelector(
      'button#entrar',
    );

    await findLogInButtonElement.click();

    try {
      await this.page.driver.waitForSelector('div#resp.alerts', {
        timeout: 5000,
      });

      await findLogInButtonElement.click();
    } catch {
      // continue
    } finally {
      await this.page.driver.waitForSelector(
        '#menu04400d48d04acd3599cf545dafbb90ed > div > a',
      );

      await sleep(2000);
    }

    return false;
  }
}
