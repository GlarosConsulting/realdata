import { container, inject, injectable } from 'tsyringe';

import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import { IHandler } from '@robot/shared/modules/browser/models/IBrowser';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IExtendedCustomerIXC from '@shared/models/IExtendedCustomerIXC';

import ContaAzulCustomersCreatePage from '@modules/conta_azul/customers/create/infra/puppeteer/pages/ContaAzulCustomersCreatePage';

@injectable()
class ContaAzulCustomersCreateHandler implements IHandler {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async handle(_browser: any, page: Page): Promise<void> {
    page.driver.bringToFront();
    container.registerInstance('Page', page);

    const contaAzulCustomersCreatePage = new ContaAzulCustomersCreatePage();

    await contaAzulCustomersCreatePage.navigateTo();

    const recoveredContaAzulCustomer = await this.cacheProvider.recover<
      IExtendedCustomerIXC
    >('conta-azul-customer');

    if (!recoveredContaAzulCustomer) {
      const recoveredIxcCustomer = await this.cacheProvider.recover<
        IExtendedCustomerIXC
      >('ixc-customer');

      await contaAzulCustomersCreatePage.create({
        person_type: 'fisica',
        document: recoveredIxcCustomer.document,
        name: recoveredIxcCustomer.name,
        ixc_id: recoveredIxcCustomer.id,
        additional_info: {
          email: recoveredIxcCustomer.details.contact.email,
          phone_commercial:
            recoveredIxcCustomer.details.contact.phone_commercial,
          phone_mobile: recoveredIxcCustomer.details.contact.phone_mobile,
          birth_date: recoveredIxcCustomer.details.main.birth_date,
          rg: recoveredIxcCustomer.identity,
        },
        address: {
          cep: recoveredIxcCustomer.details.address.cep,
          number: recoveredIxcCustomer.details.address.number,
          complement: recoveredIxcCustomer.details.address.complement,
        },
      });
    }
  }
}

export default ContaAzulCustomersCreateHandler;
