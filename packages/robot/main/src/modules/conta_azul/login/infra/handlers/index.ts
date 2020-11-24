import { container, inject, injectable } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import { IHandler } from '@robot/shared/modules/browser/models/IBrowser';

import IConfigurationProvider from '@shared/container/providers/ConfigurationProvider/models/IConfigurationProvider';

import ContaAzulLogInPage from '@modules/conta_azul/login/infra/puppeteer/pages/ContaAzulLogInPage';

@injectable()
class ContaAzulLogInHandler implements IHandler {
  constructor(
    @inject('ConfigurationProvider')
    private configurationProvider: IConfigurationProvider,
  ) {}

  public async handle(_browser: any, page: Page): Promise<void> {
    page.driver.bringToFront();
    container.registerInstance('Page', page);

    const contaAzulLogInPage = new ContaAzulLogInPage();

    await contaAzulLogInPage.navigateTo();

    const {
      conta_azul: { email, password },
    } = await this.configurationProvider.pick(['conta_azul']);

    await contaAzulLogInPage.logIn({ email, password });
  }
}

export default ContaAzulLogInHandler;
