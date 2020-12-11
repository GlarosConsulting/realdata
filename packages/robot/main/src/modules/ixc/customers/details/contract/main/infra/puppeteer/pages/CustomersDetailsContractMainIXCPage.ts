import { container } from 'tsyringe';

import IContractIXC from '@modules/ixc/customers/details/contract/main/models/IContractIXC';
import ICustomersDetailsContractMainIXCPage from '@modules/ixc/customers/details/contract/main/pages/ICustomersDetailsContractMainIXCPage';
import ExtractContractListService from '@modules/ixc/customers/details/contract/main/services/ExtractContractListService';
import NavigateToContractTabService from '@modules/ixc/customers/details/contract/main/services/NavigateToContractTabService';

class CustomersDetailsContractMainIXCPage
  implements ICustomersDetailsContractMainIXCPage {
  public async navigateTo(): Promise<void> {
    const navigateToContractTab = container.resolve(
      NavigateToContractTabService,
    );

    await navigateToContractTab.execute();
  }

  public async getAll(): Promise<IContractIXC[]> {
    const extractContractList = container.resolve(ExtractContractListService);

    const contracts = await extractContractList.execute();

    return contracts;
  }
}

export default CustomersDetailsContractMainIXCPage;
