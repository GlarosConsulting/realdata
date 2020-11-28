import { addDays, isAfter, isBefore, set as setDate, subDays } from 'date-fns';
import { container, injectable, inject } from 'tsyringe';

import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import IBrowser from '@robot/shared/modules/browser/models/IBrowser';
import IBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/models/IBrowserProvider';

import formatIxcContractProductsToContaAzul from '@utils/formatIxcContractProductsToContaAzul';
import Timer from '@utils/timer';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IConfigurationProvider from '@shared/container/providers/ConfigurationProvider/models/IConfigurationProvider';
import IExtendedCustomerIXC from '@shared/models/IExtendedCustomerIXC';
import api from '@shared/services/api';

import ContaAzulBillsToReceiveDetailsPage from '@modules/conta_azul/bills_to_receive/details/infra/puppeteer/pages/ContaAzulBillsToReceiveDetailsPage';
import ContaAzulBillToReceiveMainPage from '@modules/conta_azul/bills_to_receive/main/infra/puppeteer/pages/ContaAzulBillToReceiveMainPage';
import ContaAzulContractsCreatePage from '@modules/conta_azul/contracts/create/infra/puppeteer/pages/ContaAzulContractsCreatePage';
import ContaAzulCustomersCreatePage from '@modules/conta_azul/customers/create/infra/puppeteer/pages/ContaAzulCustomersCreatePage';
import ContaAzulCustomersMainPage from '@modules/conta_azul/customers/main/infra/puppeteer/pages/ContaAzulCustomersMainPage';
import ContaAzulLogInHandler from '@modules/conta_azul/login/infra/handlers';
import CustomersDetailsAddressIXCPage from '@modules/ixc/customers/details/address/infra/puppeteer/pages/CustomersDetailsAddressIXCPage';
import CustomersDetailsContactIXCPage from '@modules/ixc/customers/details/contact/infra/puppeteer/pages/CustomersDetailsContactIXCPage';
import CustomersDetailsContractIXCPage from '@modules/ixc/customers/details/contract/infra/puppeteer/pages/CustomersDetailsContractIXCPage';
import CustomersDetailsFinanceIXCPage from '@modules/ixc/customers/details/finance/infra/puppeteer/pages/CustomersDetailsFinanceIXCPage';
import CustomersDetailsMainIXCPage from '@modules/ixc/customers/details/main/infra/puppeteer/pages/CustomersDetailsMainIXCPage';
import CustomersMainIXCPage from '@modules/ixc/customers/main/infra/puppeteer/pages/CustomersMainIXCPage';
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

    const switchPage = (page: Page) => {
      page.driver.bringToFront();
      container.registerInstance('Page', page);
    };

    // const ixcIds = testingCustomersConfig.map(customer => customer.ixc.id);
    // const ixcIds = ['12636']; // KARLA ANGELINA
    // const ixcIds = ['14211']; // GLAROS
    // const ixcIds = ['10902']; // LUCAS SILVA NERES
    // const ixcIds = ['10863']; // RAPHAEL
    // const ixcIds = ['10981']; // Star Brasil Distribuidora de Produtos LTDA
    // const ixcIds = ['11002']; // Perfilbrás Indústria e Comércio LTDA
    // const ixcIds = ['10877']; // Ghia Car Auto Portas Ltda
    // const ixcIds = ['10979']; // William de Moro
    // const ixcIds = ['10930']; // Luis Otavio Soares de Andrade

    const ixcIds = [];
    const usedIxcIds = [];

    for (let i = 10626; i < 14233; i++) {
      ixcIds.push(String(i));
    }

    console.log('IDs:', JSON.stringify(ixcIds));

    for (const ixcId of ixcIds) {
      usedIxcIds.push(ixcId);

      console.log();
      console.log('USED IDS: ', JSON.stringify(usedIxcIds));
      console.log();

      switchPage(page1);

      const customersMainIxcPage = new CustomersMainIXCPage();
      const customersDetailsMainIxcPage = new CustomersDetailsMainIXCPage();
      const customersDetailsAddressIxcPage = new CustomersDetailsAddressIXCPage();
      const customersDetailsContactIxcPage = new CustomersDetailsContactIXCPage();
      const customersDetailsFinanceIxcPage = new CustomersDetailsFinanceIXCPage();
      const customersDetailsContractIxcPage = new CustomersDetailsContractIXCPage();

      await customersMainIxcPage.navigateTo();

      const ixcCustomer = await customersMainIxcPage.findByField({
        field: 'id',
        value: ixcId,
      });

      if (!ixcCustomer || !ixcCustomer.active) {
        continue;
      }

      await customersDetailsMainIxcPage.open({
        customer_id: ixcCustomer.id,
      });

      const mainDetails = await customersDetailsMainIxcPage.getMainDetails();

      await customersDetailsAddressIxcPage.navigateTo();

      const addressInfo = await customersDetailsAddressIxcPage.getAddressInfo();

      await customersDetailsMainIxcPage.navigateTo();
      await customersDetailsContactIxcPage.navigateTo();

      const contactInfo = await customersDetailsContactIxcPage.getContactInfo();

      await customersDetailsMainIxcPage.navigateTo();
      await customersDetailsFinanceIxcPage.navigateTo();

      const finances = await customersDetailsFinanceIxcPage.getAll();

      await customersDetailsMainIxcPage.navigateTo();
      await customersDetailsContractIxcPage.navigateTo();

      const contracts = await customersDetailsContractIxcPage.getAll();

      await customersDetailsMainIxcPage.navigateTo();

      const extendedCustomerIxc: IExtendedCustomerIXC = {
        ...ixcCustomer,
        details: {
          main: mainDetails,
          address: addressInfo,
          contact: contactInfo,
          finances,
          contracts,
        },
      };

      console.log();
      console.log('IXC ID:', ixcId);
      console.log(JSON.stringify(extendedCustomerIxc));
      console.log();

      switchPage(page2);

      const contaAzulCustomersMainPage = new ContaAzulCustomersMainPage();

      await contaAzulCustomersMainPage.navigateTo();

      let contaAzulCustomer = await contaAzulCustomersMainPage.findByField({
        field: 'document',
        value: extendedCustomerIxc.document,
      });

      if (!contaAzulCustomer) {
        const contaAzulCustomersCreatePage = new ContaAzulCustomersCreatePage();

        await contaAzulCustomersCreatePage.navigateTo();

        await contaAzulCustomersCreatePage.create({
          person_type: extendedCustomerIxc.details.main.person_type,
          document: extendedCustomerIxc.document,
          name: extendedCustomerIxc.name,
          fantasy_name: extendedCustomerIxc.fantasy_name,
          ixc_id: extendedCustomerIxc.id,
          additional_info: {
            email: extendedCustomerIxc.details.contact.email,
            phone_commercial:
              extendedCustomerIxc.details.contact.phone_commercial,
            phone_mobile: extendedCustomerIxc.details.contact.phone_mobile,
            birth_date: extendedCustomerIxc.details.main.birth_date.toISOString(),
            identity: extendedCustomerIxc.identity,
          },
          address: {
            cep: extendedCustomerIxc.details.address.cep,
            number: extendedCustomerIxc.details.address.number,
            complement: extendedCustomerIxc.details.address.complement,
          },
        });

        if (extendedCustomerIxc.details.main.person_type === 'fisica') {
          contaAzulCustomer = {
            name: extendedCustomerIxc.name,
            document: extendedCustomerIxc.document,
            email: extendedCustomerIxc.details.contact.email,
            phone: extendedCustomerIxc.details.contact.phone_mobile,
            active: true,
          };
        } else if (
          extendedCustomerIxc.details.main.person_type === 'juridica'
        ) {
          contaAzulCustomer = {
            name: extendedCustomerIxc.fantasy_name,
            document: extendedCustomerIxc.document,
            email: extendedCustomerIxc.details.contact.email,
            phone: extendedCustomerIxc.details.contact.phone_mobile,
            active: true,
          };
        }

        const contaAzulContractsCreatePage = new ContaAzulContractsCreatePage();

        for (const contract of extendedCustomerIxc.details.contracts.filter(
          item => item.status,
        )) {
          await contaAzulContractsCreatePage.navigateTo();

          let always_charge_on_day: number;

          if (isBefore(contract.activation_date, new Date(2020, 10, 13))) {
            if (contract.activation_date.getDate() <= 5) {
              always_charge_on_day = 5;
            } else if (contract.activation_date.getDate() >= 6) {
              always_charge_on_day = contract.activation_date.getDate();
            }
          } else if (contract.activation_date.getDate() <= 26) {
            always_charge_on_day = contract.activation_date.getDate();
          } else if (contract.activation_date.getDate() >= 27) {
            always_charge_on_day = 26;
          }

          await contaAzulContractsCreatePage.create({
            document: extendedCustomerIxc.document,
            category: 'Vendas',
            sell_date: setDate(contract.activation_date, {
              date: always_charge_on_day + 1,
            }).toISOString(),
            always_charge_on_day,
            products: formatIxcContractProductsToContaAzul(
              contract.products.items,
            ),
          });
        }
      }

      const contaAzulBillToReceiveMainPage = new ContaAzulBillToReceiveMainPage();

      await contaAzulBillToReceiveMainPage.navigateTo();

      const billsToReceive = await contaAzulBillToReceiveMainPage.findByField({
        field: 'launch.customer_name',
        value: contaAzulCustomer.name,
      });

      const contaAzulBillsToReceiveDetailsPage = new ContaAzulBillsToReceiveDetailsPage();

      for (const billToReceive of billsToReceive) {
        const filterReceivedBills = extendedCustomerIxc.details.finances.filter(
          receivedBill => {
            const dateLessThreeDays = subDays(billToReceive.date, 3);
            const dateMoreThreeDays = addDays(billToReceive.date, 3);

            if (
              billToReceive.value === receivedBill.value &&
              isAfter(receivedBill.due_date, dateLessThreeDays) &&
              isBefore(receivedBill.due_date, dateMoreThreeDays)
            ) {
              return true;
            }

            return false;
          },
        );

        if (filterReceivedBills.length === 0) {
          console.log();
          console.log('Not found any received bills...');
          console.log('Bill To Receive: ', JSON.stringify(billToReceive));
          console.log();

          await api.post('/logs', {
            date: new Date(),
            ixc_id: `${extendedCustomerIxc.id} - ${extendedCustomerIxc.name}`,
            projection_id: billToReceive.sell_id,
            conta_azul_existing: true,
            discharge_performed: false,
          });

          continue;
        }

        if (filterReceivedBills.length > 1) {
          console.log();
          console.log('Found multiple received bills...');
          console.log();

          continue;
        }

        const finance = filterReceivedBills[0];

        if (finance.status !== 'Recebido') {
          continue;
        }

        // console.log('Bill To Receive: ', billToReceive);
        // console.log('IXC Filter Bills To Receive: ', filterReceivedBills);
        // console.log();

        await contaAzulBillsToReceiveDetailsPage.open({
          bill_to_receive_sell_id: billToReceive.sell_id,
        });

        await contaAzulBillsToReceiveDetailsPage.fillData({
          account: 'Sicoob Crediuna',
          received_date: finance.received_date.toISOString(),
          discount: 0,
          interest: Number((finance.paid_value - finance.value).toFixed(2)),
          paid: finance.paid_value,
          transaction_id: finance.id,
          sell_id: finance.sell_id,
        });
      }

      // await page2.driver.reload();
    }

    timer.stop();

    const formattedTimer = timer.format();

    console.log(`\nElapsed time: ${formattedTimer}`);
  }
}
