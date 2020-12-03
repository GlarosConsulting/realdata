import { container } from 'tsyringe';

import IContractDetailsContaAzul from '@modules/conta_azul/contracts/details/models/IContractDetailsContaAzul';
import IContaAzulContractsDetailsPage from '@modules/conta_azul/contracts/details/pages/IContaAzulContractsDetailsPage';
import ExtractContractDetailsService from '@modules/conta_azul/contracts/details/services/ExtractContractDetailsService';
import NavigateToContractDetailsPageService from '@modules/conta_azul/contracts/details/services/NavigateToContractDetailsPageService';
import IContractContaAzul from '@modules/conta_azul/contracts/main/models/IContractContaAzul';

class ContaAzulContractsDetailsPage implements IContaAzulContractsDetailsPage {
  public async navigateTo(contract: IContractContaAzul): Promise<void> {
    const navigateToContractDetailsPage = container.resolve(
      NavigateToContractDetailsPageService,
    );

    await navigateToContractDetailsPage.execute({ contract });
  }

  public async getDetails(): Promise<IContractDetailsContaAzul> {
    const extractContractDetails = container.resolve(
      ExtractContractDetailsService,
    );

    const contractDetails = await extractContractDetails.execute();

    return contractDetails;
  }
}

export default ContaAzulContractsDetailsPage;
