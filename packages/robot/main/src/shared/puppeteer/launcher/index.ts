import { container, injectable, inject } from 'tsyringe';

import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import IBrowser from '@robot/shared/modules/browser/models/IBrowser';
import IBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/models/IBrowserProvider';

import testingCustomersConfig from '@config/testing_customers';

import Timer from '@utils/timer';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IConfigurationProvider from '@shared/container/providers/ConfigurationProvider/models/IConfigurationProvider';
import IExtendedCustomerIXC from '@shared/models/IExtendedCustomerIXC';

import ContaAzulCustomersCreateHandler from '@modules/conta_azul/customers/create/infra/handlers';
import ContaAzulCustomersMainHandler from '@modules/conta_azul/customers/main/infra/handlers';
import ContaAzulLogInHandler from '@modules/conta_azul/login/infra/handlers';
import IXCCustomersDetailsAddressHandler from '@modules/ixc/customers/details/address/infra/handlers';
import IXCCustomersDetailsContactHandler from '@modules/ixc/customers/details/contact/infra/handlers';
import IXCCustomersDetailsFinanceHandler from '@modules/ixc/customers/details/finance/infra/handlers';
import IXCCustomersDetailsMainHandler from '@modules/ixc/customers/details/main/infra/handlers';
import IXCCustomersMainHandler from '@modules/ixc/customers/main/infra/handlers';
import IXCLogInHandler from '@modules/ixc/login/infra/handlers';

@injectable()
export default class Launcher {
  constructor(
    @inject('ConfigurationProvider')
    private configurationProvider: IConfigurationProvider,

    @inject('BrowserProvider')
    private browserProvider: IBrowserProvider<Browser>,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async launch(): Promise<void> {
    const {
      ixc: { email },
      headless,
    } = await this.configurationProvider.pick(['ixc', 'headless']);

    const timer = new Timer(`realdata-robot-${email}`);

    timer.start();

    const browser = await this.browserProvider.launch({ headless });

    const page1 = await browser.newPage();
    const page2 = await browser.newPage();

    container.registerInstance<IBrowser<any, any>>('Browser', browser);

    await browser.run(page1, IXCLogInHandler);
    await browser.run(page2, ContaAzulLogInHandler);

    const ixcIds = testingCustomersConfig.map(customer => customer.ixc.id);

    console.log('IDs:', ixcIds);

    for (const ixcId of ixcIds) {
      await this.cacheProvider.save('ixc-id', ixcId);

      await browser.run(
        page1,
        IXCCustomersMainHandler,
        IXCCustomersDetailsMainHandler,
        IXCCustomersDetailsAddressHandler,
        IXCCustomersDetailsContactHandler,
        IXCCustomersDetailsFinanceHandler,
      );

      await browser.run(
        page2,
        ContaAzulCustomersMainHandler,
        ContaAzulCustomersCreateHandler,
      );

      await page2.driver.reload();

      const ixcCustomer = await this.cacheProvider.recover<
        IExtendedCustomerIXC
      >('ixc-customer');

      console.log('IXC ID:', ixcId);
      console.log(JSON.stringify(ixcCustomer));
    }

    timer.stop();

    const formattedTimer = timer.format();

    console.log(`\nElapsed time: ${formattedTimer}`);
  }
}
