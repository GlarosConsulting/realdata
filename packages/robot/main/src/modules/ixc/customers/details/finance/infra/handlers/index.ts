import { merge } from 'lodash';
import { inject, injectable } from 'tsyringe';

import { IHandler } from '@robot/shared/modules/browser/models/IBrowser';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IExtendedCustomerIXC from '@shared/models/IExtendedCustomerIXC';

import CustomersDetailsFinanceIXCPage from '@modules/ixc/customers/details/finance/infra/puppeteer/pages/CustomersDetailsFinanceIXCPage';
import CustomersDetailsMainIXCPage from '@modules/ixc/customers/details/main/infra/puppeteer/pages/CustomersDetailsMainIXCPage';

@injectable()
class IXCCustomersDetailsFinanceHandler implements IHandler {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async handle(): Promise<void> {
    const customersDetailsFinanceIxcPage = new CustomersDetailsFinanceIXCPage();

    await customersDetailsFinanceIxcPage.navigateTo();

    const finances = await customersDetailsFinanceIxcPage.getAll();

    // console.log(finances);

    const customersDetailsMainIxcPage = new CustomersDetailsMainIXCPage();

    await customersDetailsMainIxcPage.navigateTo();

    let data = {
      details: {
        finances,
      },
    } as IExtendedCustomerIXC;

    const recoveredCustomer = await this.cacheProvider.recover<
      IExtendedCustomerIXC
    >('customer');

    if (recoveredCustomer) {
      data = merge(recoveredCustomer, data);
    }

    await this.cacheProvider.save('customer', data);
  }
}

export default IXCCustomersDetailsFinanceHandler;
