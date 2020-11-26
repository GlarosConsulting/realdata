import { container } from 'tsyringe';

import IFindCustomerByFieldDTO from '@modules/conta_azul/customers/main/dtos/IFindCustomerByFieldDTO';
import ICustomerContaAzul from '@modules/conta_azul/customers/main/models/ICustomerContaAzul';
import IContaAzulCustomersMainPage from '@modules/conta_azul/customers/main/pages/IContaAzulCustomersMainPage';
import ExtractCustomersListService from '@modules/conta_azul/customers/main/services/ExtractCustomersListService';
import FindCustomerByFieldService from '@modules/conta_azul/customers/main/services/FindCustomerByFieldService';
import NavigateToCustomersPageService from '@modules/conta_azul/customers/main/services/NavigateToCustomersPageService';

class ContaAzulCustomersMainPage implements IContaAzulCustomersMainPage {
  public async navigateTo(): Promise<void> {
    const navigateToCustomersPage = container.resolve(
      NavigateToCustomersPageService,
    );

    await navigateToCustomersPage.execute();
  }

  public async getAll(): Promise<ICustomerContaAzul[]> {
    const extractCustomersList = container.resolve(ExtractCustomersListService);

    const customers = await extractCustomersList.execute();

    return customers;
  }

  public async findByField({
    field,
    value,
  }: IFindCustomerByFieldDTO): Promise<ICustomerContaAzul> {
    const findCustomerByField = container.resolve(FindCustomerByFieldService);

    const customer = await findCustomerByField.execute({ field, value });

    return customer;
  }
}

export default ContaAzulCustomersMainPage;
