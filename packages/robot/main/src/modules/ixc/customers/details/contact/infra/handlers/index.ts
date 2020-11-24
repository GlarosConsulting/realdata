import { merge } from 'lodash';
import { container, inject, injectable } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import { IHandler } from '@robot/shared/modules/browser/models/IBrowser';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IExtendedCustomerIXC from '@shared/models/IExtendedCustomerIXC';

import CustomersDetailsContactIXCPage from '@modules/ixc/customers/details/contact/infra/puppeteer/pages/CustomersDetailsContactIXCPage';
import CustomersDetailsMainIXCPage from '@modules/ixc/customers/details/main/infra/puppeteer/pages/CustomersDetailsMainIXCPage';

@injectable()
class IXCCustomersDetailsContactHandler implements IHandler {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async handle(_browser: any, page: Page): Promise<void> {
    page.driver.bringToFront();
    container.registerInstance('Page', page);

    const customersDetailsContactIxcPage = new CustomersDetailsContactIXCPage();

    await customersDetailsContactIxcPage.navigateTo();

    const contactInfo = await customersDetailsContactIxcPage.getContactInfo();

    // console.log(contactInfo);

    const customersDetailsMainIxcPage = new CustomersDetailsMainIXCPage();

    await customersDetailsMainIxcPage.navigateTo();

    let data = {
      details: {
        contact: contactInfo,
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

export default IXCCustomersDetailsContactHandler;
