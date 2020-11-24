import { container, inject, injectable } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import { IHandler } from '@robot/shared/modules/browser/models/IBrowser';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IExtendedCustomerIXC from '@shared/models/IExtendedCustomerIXC';

import ContaAzulCustomersMainPage from '@modules/conta_azul/customers/main/infra/puppeteer/pages/ContaAzulCustomersMainPage';

@injectable()
class ContaAzulCustomersMainHandler implements IHandler {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async handle(_browser: any, page: Page): Promise<void> {
    page.driver.bringToFront();
    container.registerInstance('Page', page);

    const contaAzulCustomersMainPage = new ContaAzulCustomersMainPage();

    await contaAzulCustomersMainPage.navigateTo();

    // console.log(customers);

    const recoveredIxcCustomer = await this.cacheProvider.recover<
      IExtendedCustomerIXC
    >('ixc-customer');

    await this.cacheProvider.save('conta-azul-customer', null);

    const customer = await contaAzulCustomersMainPage.findByField({
      field: 'document',
      value: recoveredIxcCustomer.document,
    });

    await this.cacheProvider.save('conta-azul-customer', customer);
  }
}

export default ContaAzulCustomersMainHandler;
