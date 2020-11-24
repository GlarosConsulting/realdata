import { merge } from 'lodash';
import { container, inject, injectable } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import { IHandler } from '@robot/shared/modules/browser/models/IBrowser';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IExtendedCustomerIXC from '@shared/models/IExtendedCustomerIXC';

import CustomersDetailsAddressIXCPage from '@modules/ixc/customers/details/address/infra/puppeteer/pages/CustomersDetailsAddressIXCPage';
import CustomersDetailsMainIXCPage from '@modules/ixc/customers/details/main/infra/puppeteer/pages/CustomersDetailsMainIXCPage';

@injectable()
class IXCCustomersDetailsAddressHandler implements IHandler {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async handle(_browser: any, page: Page): Promise<void> {
    page.driver.bringToFront();
    container.registerInstance('Page', page);

    const customersDetailsAddressIxcPage = new CustomersDetailsAddressIXCPage();

    await customersDetailsAddressIxcPage.navigateTo();

    const addressInfo = await customersDetailsAddressIxcPage.getAddressInfo();

    // console.log(contactInfo);

    const customersDetailsMainIxcPage = new CustomersDetailsMainIXCPage();

    await customersDetailsMainIxcPage.navigateTo();

    let data = {
      details: {
        address: addressInfo,
      },
    } as IExtendedCustomerIXC;

    const recoveredIxcCustomer = await this.cacheProvider.recover<
      IExtendedCustomerIXC
    >('ixc-customer');

    if (recoveredIxcCustomer) {
      data = merge(recoveredIxcCustomer, data);
    }

    await this.cacheProvider.save('ixc-customer', data);
  }
}

export default IXCCustomersDetailsAddressHandler;
