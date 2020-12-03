import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IContractContaAzul from '@modules/conta_azul/contracts/main/models/IContractContaAzul';

export default interface IContaAzulContractsMainPage extends IRobotPage {
  getAll(): Promise<IContractContaAzul[]>;
  findByCustomerName(name: string): Promise<IContractContaAzul[]>;
}
