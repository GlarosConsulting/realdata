import { container } from 'tsyringe';

import ILogInCredentialsDTO from '@modules/ixc/login/dtos/ILogInCredentialsDTO';
import ILogInIXCPage from '@modules/ixc/login/pages/ILogInIXCPage';
import AuthenticateUserService from '@modules/ixc/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/ixc/login/services/NavigateToLogInPageService';

class LogInIXCPage implements ILogInIXCPage {
  public async navigateTo(): Promise<void> {
    const navigateToLogInPage = container.resolve(NavigateToLogInPageService);

    await navigateToLogInPage.execute();
  }

  public async logIn({
    email,
    password,
  }: ILogInCredentialsDTO): Promise<boolean> {
    const authenticateUser = container.resolve(AuthenticateUserService);

    const result = await authenticateUser.execute({ email, password });

    return result;
  }
}

export default LogInIXCPage;
