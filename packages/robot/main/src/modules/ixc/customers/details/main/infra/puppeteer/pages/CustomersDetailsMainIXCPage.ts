import { container } from 'tsyringe';

import IOpenCustomerDetailsDTO from '@modules/ixc/customers/details/main/dtos/IOpenCustomerDetailsDTO';
import IMainDetailsIXC from '@modules/ixc/customers/details/main/models/IMainDetailsIXC';
import ICustomersDetailsMainIXCPage from '@modules/ixc/customers/details/main/pages/ICustomersDetailsMainIXCPage';
import CloseCustomerDetailsService from '@modules/ixc/customers/details/main/services/CloseCustomerDetailsService';
import ExtractMainDetailsService from '@modules/ixc/customers/details/main/services/ExtractMainDetailsService';
import NavigateToMainTabService from '@modules/ixc/customers/details/main/services/NavigateToMainTabService';
import OpenCustomerDetailsService from '@modules/ixc/customers/details/main/services/OpenCustomerDetailsService';

class CustomersDetailsMainIXCPage implements ICustomersDetailsMainIXCPage {
  public async navigateTo(): Promise<void> {
    const navigateToMainTab = container.resolve(NavigateToMainTabService);

    await navigateToMainTab.execute();
  }

  public async open({ customer_id }: IOpenCustomerDetailsDTO): Promise<void> {
    const openCustomerDetails = container.resolve(OpenCustomerDetailsService);

    await openCustomerDetails.execute({ customer_id });
  }

  public async close(): Promise<void> {
    const closeCustomerDetails = container.resolve(CloseCustomerDetailsService);

    await closeCustomerDetails.execute();
  }

  public async getMainDetails(): Promise<IMainDetailsIXC> {
    const extractMainDetails = container.resolve(ExtractMainDetailsService);

    const mainDetails = await extractMainDetails.execute();

    return mainDetails;
  }
}

export default CustomersDetailsMainIXCPage;
