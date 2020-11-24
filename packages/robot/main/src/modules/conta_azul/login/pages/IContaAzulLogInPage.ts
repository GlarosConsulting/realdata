import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import ILogInCredentialsDTO from '../dtos/ILogInCredentialsDTO';

export default interface IContaAzulLogInPage extends IRobotPage {
  logIn(credentials: ILogInCredentialsDTO): Promise<boolean>;
}
