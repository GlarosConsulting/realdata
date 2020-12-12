import { container } from 'tsyringe';

import IFinancialItemIXC from '@modules/ixc/customers/details/financial/models/IFinancialItemIXC';
import ICustomersDetailsFinanceIXCPage from '@modules/ixc/customers/details/financial/pages/ICustomersDetailsFinanceIXCPage';
import ExtractFinancialListService from '@modules/ixc/customers/details/financial/services/ExtractFinancialListService';
import NavigateToFinancialTabService from '@modules/ixc/customers/details/financial/services/NavigateToFinancialTabService';

class CustomersDetailsFinanceIXCPage
  implements ICustomersDetailsFinanceIXCPage {
  public async navigateTo(): Promise<void> {
    const navigateToFinanceTab = container.resolve(
      NavigateToFinancialTabService,
    );

    await navigateToFinanceTab.execute();
  }

  public async getAll(): Promise<IFinancialItemIXC[]> {
    const extractFinanceList = container.resolve(ExtractFinancialListService);

    const finances = await extractFinanceList.execute();

    return finances;
  }
}

export default CustomersDetailsFinanceIXCPage;
