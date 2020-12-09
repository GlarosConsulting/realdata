import { addDays, isAfter, isBefore, set as setDate, subDays } from 'date-fns';
import { container, injectable, inject } from 'tsyringe';

import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import IBrowser from '@robot/shared/modules/browser/models/IBrowser';
import IBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/models/IBrowserProvider';

import formatIxcContractProductsToContaAzul from '@utils/formatIxcContractProductsToContaAzul';
import sleep from '@utils/sleep';
import Timer from '@utils/timer';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IConfigurationProvider from '@shared/container/providers/ConfigurationProvider/models/IConfigurationProvider';
import ProcessingContaAzulError from '@shared/errors/ProcessingContaAzulError';
import IExtendedContractContaAzul from '@shared/models/IExtendedContractContaAzul';
import IExtendedCustomerIXC from '@shared/models/IExtendedCustomerIXC';
import api from '@shared/services/api';

import ContaAzulBillsToReceiveDetailsPage from '@modules/conta_azul/bills_to_receive/details/infra/puppeteer/pages/ContaAzulBillsToReceiveDetailsPage';
import ContaAzulBillToReceiveMainPage from '@modules/conta_azul/bills_to_receive/main/infra/puppeteer/pages/ContaAzulBillToReceiveMainPage';
import ContaAzulContractsCreatePage from '@modules/conta_azul/contracts/create/infra/puppeteer/pages/ContaAzulContractsCreatePage';
import ContaAzulContractsDetailsPage from '@modules/conta_azul/contracts/details/infra/puppeteer/pages/ContaAzulContractsDetailsPage';
import ContaAzulContractsMainPage from '@modules/conta_azul/contracts/main/infra/puppeteer/pages/ContaAzulContractsMainPage';
import ContaAzulContractsUpdatePage from '@modules/conta_azul/contracts/update/infra/puppeteer/pages/ContaAzulContractsUpdatePage';
import ContaAzulCustomersCreatePage from '@modules/conta_azul/customers/create/infra/puppeteer/pages/ContaAzulCustomersCreatePage';
import ContaAzulCustomersMainPage from '@modules/conta_azul/customers/main/infra/puppeteer/pages/ContaAzulCustomersMainPage';
import ContaAzulLogInHandler from '@modules/conta_azul/login/infra/handlers';
import CustomersDetailsAddressIXCPage from '@modules/ixc/customers/details/address/infra/puppeteer/pages/CustomersDetailsAddressIXCPage';
import CustomersDetailsContactIXCPage from '@modules/ixc/customers/details/contact/infra/puppeteer/pages/CustomersDetailsContactIXCPage';
import CustomersDetailsContractIXCPage from '@modules/ixc/customers/details/contract/infra/puppeteer/pages/CustomersDetailsContractIXCPage';
import IContractIXC from '@modules/ixc/customers/details/contract/models/IContractIXC';
import CustomersDetailsFinanceIXCPage from '@modules/ixc/customers/details/finance/infra/puppeteer/pages/CustomersDetailsFinanceIXCPage';
import CustomersDetailsMainIXCPage from '@modules/ixc/customers/details/main/infra/puppeteer/pages/CustomersDetailsMainIXCPage';
import CustomersMainIXCPage from '@modules/ixc/customers/main/infra/puppeteer/pages/CustomersMainIXCPage';
import IXCLogInHandler from '@modules/ixc/login/infra/handlers';

interface IRunPageFlow {
  pages: {
    ixc: Page;
    conta_azul: Page;
  };
  ixc_id: number;
}

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

    const ixcAttempts: { [key: string]: number } = {};

    const switchPage = (page: Page) => {
      page.driver.bringToFront();
      container.registerInstance('Page', page);
    };

    const runPagesFlow = async ({ pages, ixc_id }: IRunPageFlow) => {
      switchPage(pages.ixc);

      const customersMainIxcPage = new CustomersMainIXCPage();
      const customersDetailsMainIxcPage = new CustomersDetailsMainIXCPage();
      const customersDetailsAddressIxcPage = new CustomersDetailsAddressIXCPage();
      const customersDetailsContactIxcPage = new CustomersDetailsContactIXCPage();
      const customersDetailsFinanceIxcPage = new CustomersDetailsFinanceIXCPage();
      const customersDetailsContractIxcPage = new CustomersDetailsContractIXCPage();

      const ixcCustomer = await customersMainIxcPage.findByField({
        field: 'id',
        value: String(ixc_id),
      });

      if (!ixcCustomer) {
        return;
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

      const ixcContracts = await customersDetailsContractIxcPage.getAll();

      await customersDetailsMainIxcPage.navigateTo();

      await customersDetailsMainIxcPage.close();

      const extendedCustomerIxc: IExtendedCustomerIXC = {
        ...ixcCustomer,
        details: {
          main: mainDetails,
          address: addressInfo,
          contact: contactInfo,
          finances,
          contracts: ixcContracts,
        },
      };

      console.log(JSON.stringify(extendedCustomerIxc));
      console.log();

      try {
        switchPage(pages.conta_azul);

        const contaAzulCustomersMainPage = new ContaAzulCustomersMainPage();
        const contaAzulContractsCreatePage = new ContaAzulContractsCreatePage();

        await contaAzulCustomersMainPage.navigateTo();

        let contaAzulCustomer = await contaAzulCustomersMainPage.findByField({
          field: 'document',
          value: extendedCustomerIxc.document,
        });

        const ixcActiveContracts = extendedCustomerIxc.details.contracts.filter(
          item => item.status,
        );

        if (!extendedCustomerIxc.active) {
          if (!contaAzulCustomer) {
            return;
          }

          await contaAzulCustomersMainPage.disable(contaAzulCustomer.name);

          return;
        }

        if (!contaAzulCustomer) {
          if (!extendedCustomerIxc.details.main.birth_date) {
            return;
          }

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
              name: extendedCustomerIxc.fantasy_name
                ? extendedCustomerIxc.fantasy_name
                : extendedCustomerIxc.name,
              document: extendedCustomerIxc.document,
              email: extendedCustomerIxc.details.contact.email,
              phone: extendedCustomerIxc.details.contact.phone_mobile,
              active: true,
            };
          }
        }

        const contaAzulContractsMainPage = new ContaAzulContractsMainPage();

        await contaAzulContractsMainPage.navigateTo();

        const contaAzulContracts = await contaAzulContractsMainPage.findByCustomerName(
          contaAzulCustomer.name,
        );

        const contaAzulActiveContracts = contaAzulContracts.filter(
          contract => contract.active,
        );

        if (contaAzulActiveContracts.length === 0) {
          for (const contract of ixcActiveContracts) {
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

            const contractProducts = formatIxcContractProductsToContaAzul(
              contract.products.items,
            );

            if (contractProducts.length === 0) {
              continue;
            }

            await contaAzulContractsCreatePage.create({
              name: contaAzulCustomer.name,
              document: extendedCustomerIxc.document,
              category: 'Vendas',
              sell_date: setDate(contract.activation_date, {
                date: always_charge_on_day + 1,
              }).toISOString(),
              always_charge_on_day,
              products: contractProducts,
              ixc_contract_id: contract.id,
            });
          }
        } else {
          const extendedContaAzulContracts: IExtendedContractContaAzul[] = [];

          for (const contaAzulContract of contaAzulActiveContracts) {
            const contaAzulContractsDetailsPage = new ContaAzulContractsDetailsPage();

            await contaAzulContractsDetailsPage.navigateTo(contaAzulContract);

            const contractDetails = await contaAzulContractsDetailsPage.getDetails();

            const extendedContract: IExtendedContractContaAzul = {
              ...contaAzulContract,
              details: contractDetails,
            };

            extendedContaAzulContracts.push(extendedContract);

            if (
              contaAzulActiveContracts.indexOf(contaAzulContract) <
              contaAzulActiveContracts.length - 1
            ) {
              await contaAzulContractsMainPage.navigateTo();

              await contaAzulContractsMainPage.findByCustomerName(
                contaAzulCustomer.name,
              );
            }
          }

          const linkedContracts: Array<{
            ixc: IContractIXC;
            conta_azul: IExtendedContractContaAzul;
          }> = [];

          for (const ixcContract of ixcActiveContracts) {
            const contractProducts = formatIxcContractProductsToContaAzul(
              ixcContract.products.items,
            );

            const filteredSimilarContaAzulContracts = extendedContaAzulContracts.filter(
              contaAzulContract => {
                const checkContainsEveryProduct = contaAzulContract.details.products.every(
                  contaAzulProduct =>
                    contractProducts.some(
                      ixcProduct => ixcProduct.name === contaAzulProduct.name,
                    ),
                );

                return (
                  contaAzulContract.monthly_value ===
                    ixcContract.products.gross_value &&
                  checkContainsEveryProduct
                );
              },
            );

            if (filteredSimilarContaAzulContracts.length === 0) {
              console.log('NOT FOUND ANY SIMILAR CONTRACT');
              continue;
            }

            if (filteredSimilarContaAzulContracts.length > 1) {
              console.log('MORE THAN ONE SIMILAR');
              continue;
            }

            linkedContracts.push({
              ixc: ixcContract,
              conta_azul: filteredSimilarContaAzulContracts[0],
            });
          }

          const contaAzulContractsUpdatePage = new ContaAzulContractsUpdatePage();

          for (const linkedContract of linkedContracts) {
            if (!linkedContract.conta_azul.details.description) {
              await contaAzulContractsUpdatePage.navigateTo(
                linkedContract.conta_azul.details.id,
              );

              await contaAzulContractsUpdatePage.update({
                description: `ID Contrato IXC: ${linkedContract.ixc.id}`,
              });
            }
          }

          // TODO: create contracts
        }

        const contaAzulBillToReceiveMainPage = new ContaAzulBillToReceiveMainPage();

        await contaAzulBillToReceiveMainPage.navigateTo();

        const billsToReceive = await contaAzulBillToReceiveMainPage.findByField(
          {
            field: 'launch.customer_name',
            value: contaAzulCustomer.name,
          },
        );

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

            try {
              await api.post('/logs', {
                date: new Date(),
                ixc_id: `${extendedCustomerIxc.id} - ${extendedCustomerIxc.name}`,
                projection_id: billToReceive.sell_id,
                conta_azul_existing: true,
                discharge_performed: false,
              });
            } catch {
              // ignore catch block
            }

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

          if (finance.paid_value !== 0.01) {
            await contaAzulBillsToReceiveDetailsPage.fillData({
              account: 'Sicoob Crediuna',
              received_date: finance.received_date.toISOString(),
              discount: 0,
              interest: Number((finance.paid_value - finance.value).toFixed(2)),
              paid: finance.paid_value,
              transaction_id: finance.id,
              sell_id: finance.sell_id,
            });
          } else {
            await contaAzulBillsToReceiveDetailsPage.fillData({
              account: 'Sicoob Crediuna',
              received_date: finance.received_date.toISOString(),
              discount:
                Number((finance.paid_value - finance.value).toFixed(2)) * -1,
              interest: 0,
              paid: finance.paid_value,
              transaction_id: finance.id,
              sell_id: finance.sell_id,
            });

            try {
              await api.post('/logs', {
                date: new Date(),
                ixc_id: `${extendedCustomerIxc.id} - ${extendedCustomerIxc.name}`,
                projection_id: billToReceive.sell_id,
                conta_azul_existing: true,
                discharge_performed: true,
              });
            } catch {
              // ignore catch block
            }
          }
        }

        // await page2.driver.reload();
      } catch (err) {
        console.error(err);

        throw new ProcessingContaAzulError(extendedCustomerIxc);
      }
    };

    const launchBrowserAndPages = async (ixcIds: number[]) => {
      const browser = await this.browserProvider.launch({ headless });

      const page1 = await browser.newPage();
      const page2 = await browser.newPage();

      container.registerInstance<IBrowser<any, any>>('Browser', browser);

      await browser.run(page1, IXCLogInHandler);
      await browser.run(page2, ContaAzulLogInHandler);

      switchPage(page1);

      const customersMainIxcPage = new CustomersMainIXCPage();

      await customersMainIxcPage.navigateTo();

      for (const ixcId of ixcIds) {
        console.log();
        console.log('IXC ID:', ixcId);

        this.cacheProvider.save('last-ixc-id', ixcId);

        try {
          await runPagesFlow({
            pages: {
              ixc: page1,
              conta_azul: page2,
            },
            ixc_id: ixcId,
          });
        } catch (err) {
          if (err instanceof ProcessingContaAzulError) {
            await browser.close();

            throw err;
          }
        }

        this.cacheProvider.save('last-success-ixc-id', ixcId);
      }

      await browser.close();
    };

    const run = async (startIxcId = 10626) => {
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
      // const ixcIds = ['11559']; // Thiago de Queiroz

      const ixcIds = [
        13260,
        13388,
        13402,
        13492,
        13493,
        13577,
        13585,
        13591,
        13636,
        13654,
        13668,
        13769,
        13817,
        13818,
        13819,
        13820,
        13821,
        13823,
        13825,
        13826,
        13827,
        13830,
        13896,
        13900,
        13920,
        14022,
        12161,
        12210,
        12224,
        12406,
        10796,
        10863,
        10902,
        10814,
        10930,
        12625,
        13619,
        13678,
        13679,
      ]; // WITH ERROR

      // const ixcIds: number[] = [];

      // for (let i = startIxcId; i < 14430; i++) {
      //   ixcIds.push(i);
      // }

      // console.log('IDs:', JSON.stringify(ixcIds));

      try {
        await launchBrowserAndPages(ixcIds);
      } catch (err) {
        const ixcId = await this.cacheProvider.recover<number>('last-ixc-id');

        const indexOf = ixcIds.findIndex(id => id === ixcId);

        let nextIxcId = ixcIds[indexOf + 1];

        const attempts = ixcAttempts[ixcId] || 0;

        console.log();
        console.log(
          'Occurred an unexpected error while processing IXC ID:',
          ixcId,
        );

        if (attempts >= 1) {
          console.log('Skipping to:', nextIxcId);
          console.log();

          try {
            await api.post('/logs', {
              date: new Date(),
              ixc_id: `${err.ixc.id} - ${err.ixc.name}`,
              projection_id: 'Erro no Conta Azul',
              conta_azul_existing: false,
              discharge_performed: false,
            });
          } catch {
            // ignore catch block
          }
        } else {
          console.log('Trying again...');
          console.log();

          nextIxcId = ixcId;
        }

        ixcAttempts[ixcId] = attempts + 1;

        await sleep(5000);

        await run(nextIxcId);
      }
    };

    await run();

    timer.stop();

    const formattedTimer = timer.format();

    console.log(`\nElapsed time: ${formattedTimer}`);
  }
}
