import { container } from 'tsyringe';

import ISaleProductItem from '@modules/ixc/customers/details/sales/details/products/models/ISaleProductItem';
import ICustomersDetailsSalesDetailsProductsIXCPage from '@modules/ixc/customers/details/sales/details/products/pages/ICustomersDetailsSalesDetailsProductsIXCPage';
import ExtractProductsListService from '@modules/ixc/customers/details/sales/details/products/services/ExtractProductsListService';
import NavigateToProductsTabService from '@modules/ixc/customers/details/sales/details/products/services/NavigateToProductsTabService';

class CustomersDetailsSalesDetailsProductsIXCPage
  implements ICustomersDetailsSalesDetailsProductsIXCPage {
  public async navigateTo(): Promise<void> {
    const navigateToProductsTab = container.resolve(
      NavigateToProductsTabService,
    );

    await navigateToProductsTab.execute();
  }

  public async getAll(): Promise<ISaleProductItem[]> {
    const extractProductsList = container.resolve(ExtractProductsListService);

    const products = await extractProductsList.execute();

    return products;
  }
}

export default CustomersDetailsSalesDetailsProductsIXCPage;
