import { container } from 'tsyringe';

import contaAzulConfig from '@config/conta_azul';

import ICreateCustomerDTO from '@modules/conta_azul/customers/create/dtos/ICreateCustomerDTO';
import IContaAzulCustomersCreatePage from '@modules/conta_azul/customers/create/pages/IContaAzulCustomersCreatePage';
import FillCreateCustomerDataService from '@modules/conta_azul/customers/create/services/FillCreateCustomerDataService';
import NavigateToCreateCustomerPageService from '@modules/conta_azul/customers/create/services/NavigateToCreateCustomerPageService';

class ContaAzulCustomersCreatePage implements IContaAzulCustomersCreatePage {
  public async navigateTo(): Promise<void> {
    const navigateToCreateCustomerPage = container.resolve(
      NavigateToCreateCustomerPageService,
    );

    await navigateToCreateCustomerPage.execute();
  }

  public async create(data: ICreateCustomerDTO): Promise<void> {
    const fillCreateCustomerData = container.resolve(
      FillCreateCustomerDataService,
    );

    await fillCreateCustomerData.execute(
      data,
      contaAzulConfig.testing.dont_save,
    );
  }
}

export default ContaAzulCustomersCreatePage;
