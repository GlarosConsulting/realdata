import { container } from 'tsyringe';

import IContractContaAzul from '@modules/conta_azul/contracts/main/models/IContractContaAzul';
import IContaAzulContractsMainPage from '@modules/conta_azul/contracts/main/pages/IContaAzulContractsMainPage';
import ExtractContractsListService from '@modules/conta_azul/contracts/main/services/ExtractContractsListService';
import FindContractsByCustomerNameService from '@modules/conta_azul/contracts/main/services/FindContractsByCustomerNameService';
import NavigateToContractsPageService from '@modules/conta_azul/contracts/main/services/NavigateToContractsPageService';

class ContaAzulContractsMainPage implements IContaAzulContractsMainPage {
  public async navigateTo(): Promise<void> {
    const navigateToContractsPage = container.resolve(
      NavigateToContractsPageService,
    );

    await navigateToContractsPage.execute();
  }

  public async getAll(): Promise<IContractContaAzul[]> {
    const extractContractsList = container.resolve(ExtractContractsListService);

    const contracts = await extractContractsList.execute();

    return contracts;
  }

  public async findByCustomerName(name: string): Promise<IContractContaAzul[]> {
    const findContractsByCustomerName = container.resolve(
      FindContractsByCustomerNameService,
    );

    const contracts = await findContractsByCustomerName.execute({
      name,
    });

    return contracts;
  }
}

export default ContaAzulContractsMainPage;
