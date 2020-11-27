import { container } from 'tsyringe';

import ICreateContractDTO from '@modules/conta_azul/contracts/create/dtos/ICreateContractDTO';
import IContaAzulContractsCreatePage from '@modules/conta_azul/contracts/create/pages/IContaAzulContractsCreatePage';
import FillCreateContractDataService from '@modules/conta_azul/contracts/create/services/FillCreateContractDataService';
import NavigateToCreateContractPageService from '@modules/conta_azul/contracts/create/services/NavigateToCreateContractPageService';

class ContaAzulContractsCreatePage implements IContaAzulContractsCreatePage {
  public async navigateTo(): Promise<void> {
    const navigateToCreateContractPage = container.resolve(
      NavigateToCreateContractPageService,
    );

    await navigateToCreateContractPage.execute();
  }

  public async create(data: ICreateContractDTO): Promise<void> {
    const fillCreateContractData = container.resolve(
      FillCreateContractDataService,
    );

    await fillCreateContractData.execute(data);
  }
}

export default ContaAzulContractsCreatePage;
