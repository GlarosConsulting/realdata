import { container } from 'tsyringe';

import IAddressIXC from '@modules/ixc/customers/details/address/models/IAddressIXC';
import ICustomersDetailsAddressIXCPage from '@modules/ixc/customers/details/address/pages/ICustomersDetailsAddressIXCPage';
import ExtractAddressInfoService from '@modules/ixc/customers/details/address/services/ExtractAddressInfoService';
import NavigateToAddressTabService from '@modules/ixc/customers/details/address/services/NavigateToAddressTabService';

class CustomersDetailsAddressIXCPage
  implements ICustomersDetailsAddressIXCPage {
  public async navigateTo(): Promise<void> {
    const navigateToAddressTab = container.resolve(NavigateToAddressTabService);

    await navigateToAddressTab.execute();
  }

  public async getAddressInfo(): Promise<IAddressIXC> {
    const extractAddressInfo = container.resolve(ExtractAddressInfoService);

    const addressInfo = await extractAddressInfo.execute();

    return addressInfo;
  }
}

export default CustomersDetailsAddressIXCPage;
