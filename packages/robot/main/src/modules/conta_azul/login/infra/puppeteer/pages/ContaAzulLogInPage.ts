import { container } from 'tsyringe';

import ILogInCredentialsDTO from '@modules/conta_azul/login/dtos/ILogInCredentialsDTO';
import IContaAzulLogInPage from '@modules/conta_azul/login/pages/IContaAzulLogInPage';
import AuthenticateUserService from '@modules/conta_azul/login/services/AuthenticateUserService';
import NavigateToLogInPageService from '@modules/conta_azul/login/services/NavigateToLogInPageService';

class ContaAzulLogInPage implements IContaAzulLogInPage {
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

export default ContaAzulLogInPage;
