import { merge } from 'lodash';
import { container, inject, injectable } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import { IHandler } from '@robot/shared/modules/browser/models/IBrowser';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IExtendedCustomerIXC from '@shared/models/IExtendedCustomerIXC';

import CustomersDetailsMainIXCPage from '@modules/ixc/customers/details/main/infra/puppeteer/pages/CustomersDetailsMainIXCPage';

@injectable()
class IXCCustomersDetailsMainHandler implements IHandler {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async handle(_browser: any, page: Page): Promise<void> {
    page.driver.bringToFront();
    container.registerInstance('Page', page);

    const customersDetailsMainIxcPage = new CustomersDetailsMainIXCPage();

    const recoveredIxcCustomer = await this.cacheProvider.recover<
      IExtendedCustomerIXC
    >('ixc-customer');

    await customersDetailsMainIxcPage.open({
      customer_id: recoveredIxcCustomer.id,
    });

    const mainDetails = await customersDetailsMainIxcPage.getMainDetails();

    let data = {
      details: {
        main: mainDetails,
      },
    } as IExtendedCustomerIXC;

    if (recoveredIxcCustomer) {
      data = merge(recoveredIxcCustomer, data);
    }

    await this.cacheProvider.save('ixc-customer', data);
  }
}

export default IXCCustomersDetailsMainHandler;
