import { container } from 'tsyringe';

import IContractProductItemContaAzul from '@modules/conta_azul/contracts/create/models/IContractProductItemContaAzul';
import IContaAzulContractsUpdatePage from '@modules/conta_azul/contracts/update/pages/IContaAzulContractsUpdatePage';
import NavigateToUpdateContractPageService from '@modules/conta_azul/contracts/update/services/NavigateToUpdateContractPageService';
import UpdateContractProductsService from '@modules/conta_azul/contracts/update/services/UpdateContractProductsService';

class ContaAzulContractsUpdatePage implements IContaAzulContractsUpdatePage {
  public async navigateTo(): Promise<void> {
    const navigateToUpdateContractPage = container.resolve(
      NavigateToUpdateContractPageService,
    );

    await navigateToUpdateContractPage.execute();
  }

  public async updateProducts(
    newProducts: IContractProductItemContaAzul[],
  ): Promise<void> {
    const updateContractProducts = container.resolve(
      UpdateContractProductsService,
    );

    await updateContractProducts.execute({ products: newProducts });
  }
}

export default ContaAzulContractsUpdatePage;
