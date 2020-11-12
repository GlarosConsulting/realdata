import { container } from 'tsyringe';

import ILogInCredentialsDTO from '@modules/ixc/login/dtos/ILogInCredentialsDTO';
import ILogInPage from '@modules/ixc/login/pages/ILogInPage';
import AuthenticateUserService from '@modules/ixc/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/ixc/login/services/NavigateToLogInPageService';

class LogInPage implements ILogInPage {
  public async navigateTo(): Promise<void> {
    const navigateToLogInPage = container.resolve(NavigateToLogInPageService);

    await navigateToLogInPage.execute();
  }

  public async signIn({
    email,
    password,
  }: ILogInCredentialsDTO): Promise<boolean> {
    const authenticateUser = container.resolve(AuthenticateUserService);

    const result = await authenticateUser.execute({ email, password });

    return result;
  }
}

export default LogInPage;
