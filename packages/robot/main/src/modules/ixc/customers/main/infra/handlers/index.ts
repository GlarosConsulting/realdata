import { merge } from 'lodash';
import { container, inject, injectable } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import { IHandler } from '@robot/shared/modules/browser/models/IBrowser';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IExtendedCustomerIXC from '@shared/models/IExtendedCustomerIXC';

import CustomersMainIXCPage from '@modules/ixc/customers/main/infra/puppeteer/pages/CustomersMainIXCPage';

@injectable()
class IXCCustomersMainHandler implements IHandler {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async handle(_browser: any, page: Page): Promise<void> {
    page.driver.bringToFront();
    container.registerInstance('Page', page);

    const customersMainIxcPage = new CustomersMainIXCPage();

    await customersMainIxcPage.navigateTo();

    const ixcId = await this.cacheProvider.recover<string>('ixc-id');

    const customer = await customersMainIxcPage.findByField({
      field: 'id',
      value: ixcId,
    });

    // console.log(customer);

    let data = {
      ...customer,
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

export default IXCCustomersMainHandler;
