import { container } from 'tsyringe';

import IFindCustomerByFieldDTO from '@modules/ixc/customers/main/dtos/IFindCustomerByFieldDTO';
import ICustomerIXC from '@modules/ixc/customers/main/models/ICustomerIXC';
import ICustomersMainIXCPage from '@modules/ixc/customers/main/pages/ICustomersMainIXCPage';
import ExtractCustomersListService from '@modules/ixc/customers/main/services/ExtractCustomersListService';
import FindCustomerByFieldService from '@modules/ixc/customers/main/services/FindCustomerByFieldService';
import NavigateToCustomersPageService from '@modules/ixc/customers/main/services/NavigateToCustomersPageService';

class CustomersMainIXCPage implements ICustomersMainIXCPage {
  public async navigateTo(): Promise<void> {
    const navigateToCustomersPage = container.resolve(
      NavigateToCustomersPageService,
    );

    await navigateToCustomersPage.execute();
  }

  public async getAll(): Promise<ICustomerIXC[]> {
    const extractCustomersList = container.resolve(ExtractCustomersListService);

    const customers = await extractCustomersList.execute();

    return customers;
  }

  public async findByField({
    field,
    value,
  }: IFindCustomerByFieldDTO): Promise<ICustomerIXC> {
    const findCustomerByField = container.resolve(FindCustomerByFieldService);

    const customer = await findCustomerByField.execute({ field, value });

    return customer;
  }
}

export default CustomersMainIXCPage;
