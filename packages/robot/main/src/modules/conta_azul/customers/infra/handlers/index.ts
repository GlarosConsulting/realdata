import { inject, injectable } from 'tsyringe';

import { IHandler } from '@robot/shared/modules/browser/models/IBrowser';

import IConfigurationProvider from '@shared/container/providers/ConfigurationProvider/models/IConfigurationProvider';

import LogInPage from '@modules/ixc/login/infra/puppeteer/pages/LogInPage';

@injectable()
class SignInHandler implements IHandler {
  constructor(
    @inject('ConfigurationProvider')
    private configurationProvider: IConfigurationProvider,
  ) {}

  public async handle(): Promise<void> {
    const logInPage = new LogInPage();

    await logInPage.navigateTo();

    const {
      ixc: { email, password },
    } = await this.configurationProvider.pick(['ixc']);

    await logInPage.signIn({ email, password });
  }
}

export default SignInHandler;
