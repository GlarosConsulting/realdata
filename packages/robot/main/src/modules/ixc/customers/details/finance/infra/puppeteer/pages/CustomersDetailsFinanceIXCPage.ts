import { container } from 'tsyringe';

import IFinanceIXC from '@modules/ixc/customers/details/finance/models/IFinanceIXC';
import ICustomersDetailsFinanceIXCPage from '@modules/ixc/customers/details/finance/pages/ICustomersDetailsFinanceIXCPage';
import ExtractFinanceListService from '@modules/ixc/customers/details/finance/services/ExtractFinanceListService';
import NavigateToFinanceTabService from '@modules/ixc/customers/details/finance/services/NavigateToFinanceTabService';

class CustomersDetailsFinanceIXCPage
  implements ICustomersDetailsFinanceIXCPage {
  public async navigateTo(): Promise<void> {
    const navigateToFinanceTab = container.resolve(NavigateToFinanceTabService);

    await navigateToFinanceTab.execute();
  }

  public async getAll(): Promise<IFinanceIXC[]> {
    const extractFinanceList = container.resolve(ExtractFinanceListService);

    const finances = await extractFinanceList.execute();

    return finances;
  }
}

export default CustomersDetailsFinanceIXCPage;
