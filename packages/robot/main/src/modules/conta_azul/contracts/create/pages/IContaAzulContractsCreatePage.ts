import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import ICreateContractDTO from '../dtos/ICreateContractDTO';

export default interface IContaAzulContractsCreatePage extends IRobotPage {
  create(data: ICreateContractDTO): Promise<void>;
}
