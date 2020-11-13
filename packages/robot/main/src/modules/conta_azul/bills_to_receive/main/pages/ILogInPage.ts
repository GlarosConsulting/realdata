import IRobotIXCPage from '@shared/puppeteer/pages/IRobotIXCPage';

import ILogInCredentialsDTO from '../dtos/ILogInCredentialsDTO';

export default interface ILogInPage extends IRobotIXCPage {
  signIn(credentials: ILogInCredentialsDTO): Promise<boolean>;
}
