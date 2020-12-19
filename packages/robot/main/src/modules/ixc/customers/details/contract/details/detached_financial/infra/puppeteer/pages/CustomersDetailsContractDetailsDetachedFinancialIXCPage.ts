import { container } from 'tsyringe';

import ICustomersDetailsContractDetailsDetachedFinancialIXCPage from '@modules/ixc/customers/details/contract/details/detached_financial/pages/ICustomersDetailsContractDetailsDetachedFinancialIXCPage';
import ExtractDetachedFinancialListService from '@modules/ixc/customers/details/contract/details/detached_financial/services/ExtractDetachedFinancialListService';
import NavigateToDetachedFinancialTabService from '@modules/ixc/customers/details/contract/details/detached_financial/services/NavigateToDetachedFinancialTabService';
import IFinancialItemIXC from '@modules/ixc/customers/details/financial/models/IFinancialItemIXC';

class CustomersDetailsContractDetailsDetachedFinancialIXCPage
  implements ICustomersDetailsContractDetailsDetachedFinancialIXCPage {
  public async navigateTo(): Promise<void> {
    const navigateToDetachedFinancialTab = container.resolve(
      NavigateToDetachedFinancialTabService,
    );

    await navigateToDetachedFinancialTab.execute();
  }

  public async getAll(): Promise<IFinancialItemIXC[]> {
    const extractDetachedFinancialList = container.resolve(
      ExtractDetachedFinancialListService,
    );

    const detachedFinancial = await extractDetachedFinancialList.execute();

    return detachedFinancial;
  }
}

export default CustomersDetailsContractDetailsDetachedFinancialIXCPage;
