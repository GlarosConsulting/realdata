import { container } from 'tsyringe';

import contaAzulConfig from '@config/conta_azul';

import IUpdateContractDTO from '@modules/conta_azul/contracts/update/dtos/IUpdateContractDTO';
import IContaAzulContractsUpdatePage from '@modules/conta_azul/contracts/update/pages/IContaAzulContractsUpdatePage';
import NavigateToUpdateContractPageService from '@modules/conta_azul/contracts/update/services/NavigateToUpdateContractPageService';
import UpdateContractService from '@modules/conta_azul/contracts/update/services/UpdateContractService';

class ContaAzulContractsUpdatePage implements IContaAzulContractsUpdatePage {
  public async navigateTo(contract_id?: string): Promise<void> {
    const navigateToUpdateContractPage = container.resolve(
      NavigateToUpdateContractPageService,
    );

    await navigateToUpdateContractPage.execute({ contract_id });
  }

  public async update({
    products,
    description,
  }: IUpdateContractDTO): Promise<void> {
    const updateContract = container.resolve(UpdateContractService);

    await updateContract.execute(
      { products, description },
      contaAzulConfig.testing.dont_save,
    );
  }
}

export default ContaAzulContractsUpdatePage;
