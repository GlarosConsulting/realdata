import { container, inject, injectable } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import { IHandler } from '@robot/shared/modules/browser/models/IBrowser';

import IConfigurationProvider from '@shared/container/providers/ConfigurationProvider/models/IConfigurationProvider';

import LogInIXCPage from '@modules/ixc/login/infra/puppeteer/pages/LogInIXCPage';

@injectable()
class IXCLogInHandler implements IHandler {
  constructor(
    @inject('ConfigurationProvider')
    private configurationProvider: IConfigurationProvider,
  ) {}

  public async handle(_browser: any, page: Page): Promise<void> {
    page.driver.bringToFront();
    container.registerInstance('Page', page);

    const logInIxcPage = new LogInIXCPage();

    await logInIxcPage.navigateTo();

    const {
      ixc: { email, password },
    } = await this.configurationProvider.pick(['ixc']);

    await logInIxcPage.logIn({ email, password });
  }
}

export default IXCLogInHandler;
