import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IContractProductItemContaAzul from '@modules/conta_azul/contracts/create/models/IContractProductItemContaAzul';

export default interface IContaAzulContractsUpdatePage extends IRobotPage {
  updateProducts(newProducts: IContractProductItemContaAzul[]): Promise<void>;
}
