import { container } from 'tsyringe';

import ISaleIXC from '@modules/ixc/customers/details/sales/main/models/ISaleIXC';
import ICustomersDetailsSalesMainIXCPage from '@modules/ixc/customers/details/sales/main/pages/ICustomersDetailsSalesMainIXCPage';
import ExtractSalesListService from '@modules/ixc/customers/details/sales/main/services/ExtractSalesListService';
import NavigateToSalesTabService from '@modules/ixc/customers/details/sales/main/services/NavigateToSalesTabService';

class CustomersDetailsSalesMainIXCPage
  implements ICustomersDetailsSalesMainIXCPage {
  public async navigateTo(): Promise<void> {
    const navigateToSalesTab = container.resolve(NavigateToSalesTabService);

    await navigateToSalesTab.execute();
  }

  public async getAll(): Promise<ISaleIXC[]> {
    const extractSalesList = container.resolve(ExtractSalesListService);

    const sales = await extractSalesList.execute();

    return sales;
  }
}

export default CustomersDetailsSalesMainIXCPage;
