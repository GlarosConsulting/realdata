import { container } from 'tsyringe';

import IContractIXC from '@modules/ixc/customers/details/contract/models/IContractIXC';
import ICustomersDetailsContractXCPage from '@modules/ixc/customers/details/contract/pages/ICustomersDetailsContractXCPage';
import ExtractContractListService from '@modules/ixc/customers/details/contract/services/ExtractContractListService';
import NavigateToContractTabService from '@modules/ixc/customers/details/contract/services/NavigateToContractTabService';

class CustomersDetailsContractIXCPage
  implements ICustomersDetailsContractXCPage {
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

export default CustomersDetailsContractIXCPage;
