import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IContractDetailsContaAzul from '@modules/conta_azul/contracts/details/models/IContractDetailsContaAzul';
import IContractContaAzul from '@modules/conta_azul/contracts/main/models/IContractContaAzul';

export default interface IContaAzulContractsDetailsPage
  extends Omit<IRobotPage, 'navigateTo'> {
  navigateTo(contract: IContractContaAzul): Promise<void>;
  getDetails(): Promise<IContractDetailsContaAzul>;
}
