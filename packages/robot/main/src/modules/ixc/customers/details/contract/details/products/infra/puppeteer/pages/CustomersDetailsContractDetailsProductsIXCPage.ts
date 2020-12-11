import { container } from 'tsyringe';

import IContractProducts from '@modules/ixc/customers/details/contract/details/products/models/IContractProducts';
import ICustomersDetailsContractDetailsProductsIXCPage from '@modules/ixc/customers/details/contract/details/products/pages/ICustomersDetailsContractDetailsProductsIXCPage';
import ExtractProductDataService from '@modules/ixc/customers/details/contract/details/products/services/ExtractProductDataService';
import NavigateToProductTabService from '@modules/ixc/customers/details/contract/details/products/services/NavigateToProductTabService';

class CustomersDetailsContractDetailsProductsIXCPage
  implements ICustomersDetailsContractDetailsProductsIXCPage {
  public async navigateTo(): Promise<void> {
    const navigateToProductTab = container.resolve(NavigateToProductTabService);

    await navigateToProductTab.execute();
  }

  public async getData(): Promise<IContractProducts> {
    const extractProductData = container.resolve(ExtractProductDataService);

    const productData = await extractProductData.execute();

    return productData;
  }
}

export default CustomersDetailsContractDetailsProductsIXCPage;
