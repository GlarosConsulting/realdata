import { container } from 'tsyringe';

import ICustomersDetailsContractDetailsFinancialIXCPage from '@modules/ixc/customers/details/contract/details/financial/pages/ICustomersDetailsContractDetailsFinancialIXCPage';
import ExtractFinancialListService from '@modules/ixc/customers/details/contract/details/financial/services/ExtractFinancialListService';
import NavigateToFinancialTabService from '@modules/ixc/customers/details/contract/details/financial/services/NavigateToFinancialTabService';
import IFinancialItemIXC from '@modules/ixc/customers/details/financial/models/IFinancialItemIXC';

class CustomersDetailsContractDetailsFinancialIXCPage
  implements ICustomersDetailsContractDetailsFinancialIXCPage {
  public async navigateTo(): Promise<void> {
    const navigateToFinancialTab = container.resolve(
      NavigateToFinancialTabService,
    );

    await navigateToFinancialTab.execute();
  }

  public async getAll(): Promise<IFinancialItemIXC[]> {
    const extractFinancialList = container.resolve(ExtractFinancialListService);

    const financial = await extractFinancialList.execute();

    return financial;
  }
}

export default CustomersDetailsContractDetailsFinancialIXCPage;
