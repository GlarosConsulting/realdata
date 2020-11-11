import { injectable, inject } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';

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
    await this.page.type('input[type="email"]', email);
    await this.page.type('input[type="password"]', password);

    const [findLogInButtonElement] = await this.page.findElementsBySelector(
      'body > div.login-page > div > div.login-page__column.login-page__column__content-side > div > div > div:nth-child(2) > div > div > div:nth-child(3) > div > div > form > div > div:nth-child(4) > div > div > span > button',
    );

    await this.page.clickForNavigate(findLogInButtonElement);

    return false;
  }
}
