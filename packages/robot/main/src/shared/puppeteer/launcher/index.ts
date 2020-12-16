import {
  set as setDate,
  addDays,
  subDays,
  addMonths,
  isAfter,
  isBefore,
  isSameMonth,
} from 'date-fns';
import { container, injectable, inject } from 'tsyringe';

import Browser from '@robot/shared/modules/browser/infra/puppeteer/models/Browser';
import Page from '@robot/shared/modules/browser/infra/puppeteer/models/Page';
import IBrowser from '@robot/shared/modules/browser/models/IBrowser';
import IBrowserProvider from '@robot/shared/modules/browser/providers/BrowserProvider/models/IBrowserProvider';

import createRangeArray from '@utils/createRangeArray';
import formatIxcContractProductsToContaAzul from '@utils/formatIxcContractProductsToContaAzul';
import sleep from '@utils/sleep';
import Timer from '@utils/timer';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IConfigurationProvider from '@shared/container/providers/ConfigurationProvider/models/IConfigurationProvider';
import ProcessingContaAzulError from '@shared/errors/ProcessingContaAzulError';
import IExtendedContractContaAzul from '@shared/models/conta_azul/IExtendedContractContaAzul';
import IExtendedContractIXC from '@shared/models/ixc/IExtendedContractIXC';
import IExtendedCustomerIXC from '@shared/models/ixc/IExtendedCustomerIXC';
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
import CustomersDetailsContractDetailsAdditionalServicesIXCPage from '@modules/ixc/customers/details/contract/details/additional_services/infra/puppeteer/pages/CustomersDetailsContractDetailsAdditionalServicesIXCPage';
import IContractAdditionalServiceItem from '@modules/ixc/customers/details/contract/details/additional_services/models/IContractAdditionalServiceItem';
import CustomersDetailsContractDetailsFinancialIXCPage from '@modules/ixc/customers/details/contract/details/financial/infra/puppeteer/pages/CustomersDetailsContractDetailsFinancialIXCPage';
import CustomersDetailsContractDetailsMainIXCPage from '@modules/ixc/customers/details/contract/details/main/infra/puppeteer/pages/CustomersDetailsContractDetailsMainIXCPage';
import CustomersDetailsContractDetailsProductsIXCPage from '@modules/ixc/customers/details/contract/details/products/infra/puppeteer/pages/CustomersDetailsContractDetailsProductsIXCPage';
import CustomersDetailsContractMainIXCPage from '@modules/ixc/customers/details/contract/main/infra/puppeteer/pages/CustomersDetailsContractMainIXCPage';
import CustomersDetailsFinanceIXCPage from '@modules/ixc/customers/details/financial/infra/puppeteer/pages/CustomersDetailsFinanceIXCPage';
import IFinancialItemIXC from '@modules/ixc/customers/details/financial/models/IFinancialItemIXC';
import CustomersDetailsMainIXCPage from '@modules/ixc/customers/details/main/infra/puppeteer/pages/CustomersDetailsMainIXCPage';
import CustomersMainIXCPage from '@modules/ixc/customers/main/infra/puppeteer/pages/CustomersMainIXCPage';
import IXCLogInHandler from '@modules/ixc/login/infra/handlers';

interface IRunPageFlow {
  pages: {
    ixc: Page;
    conta_azul: Page;
  };
  ixc_id: string;
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

    const ixcRealIds: string[] = [];

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

      const customersDetailsContractMainIxcPage = new CustomersDetailsContractMainIXCPage();
      const customersDetailsContractDetailsMainIxcPage = new CustomersDetailsContractDetailsMainIXCPage();
      const customersDetailsContractDetailsProductsIxcPage = new CustomersDetailsContractDetailsProductsIXCPage();
      const customersDetailsContractDetailsAdditionalServicesIxcPage = new CustomersDetailsContractDetailsAdditionalServicesIXCPage();
      const customersDetailsContractDetailsFinancialIxcPage = new CustomersDetailsContractDetailsFinancialIXCPage();

      const ixcCustomer = await customersMainIxcPage.findByField({
        field: 'id',
        value: ixc_id,
      });

      if (!ixcCustomer) {
        return;
      }

      ixcRealIds.push(ixc_id);

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
      await customersDetailsContractMainIxcPage.navigateTo();

      const extendedIxcContracts: IExtendedContractIXC[] = [];

      const ixcContracts = await customersDetailsContractMainIxcPage.getAll();

      for (const ixcContract of ixcContracts) {
        await customersDetailsContractDetailsMainIxcPage.open(ixcContract);

        await customersDetailsContractDetailsProductsIxcPage.navigateTo();

        const productData = await customersDetailsContractDetailsProductsIxcPage.getData();

        await customersDetailsContractDetailsAdditionalServicesIxcPage.navigateTo();

        const additionalServices = await customersDetailsContractDetailsAdditionalServicesIxcPage.getAll();

        await customersDetailsContractDetailsFinancialIxcPage.navigateTo();

        const financial = await customersDetailsContractDetailsFinancialIxcPage.getAll();

        extendedIxcContracts.push({
          ...ixcContract,
          details: {
            products: productData,
            additional_services: additionalServices,
            financial,
          },
        });

        await customersDetailsContractDetailsMainIxcPage.close();
      }

      await customersDetailsMainIxcPage.navigateTo();

      await customersDetailsMainIxcPage.close();

      const extendedCustomerIxc: IExtendedCustomerIXC = {
        ...ixcCustomer,
        details: {
          main: mainDetails,
          address: addressInfo,
          contact: contactInfo,
          finances,
          contracts: extendedIxcContracts,
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
            try {
              await api.post('/logs', {
                date: new Date(),
                ixc_id: `${extendedCustomerIxc.id} - ${extendedCustomerIxc.name}`,
                projection_id: 'Cliente sem data de nascimento',
                conta_azul_existing: false,
                discharge_performed: false,
              });
            } catch {
              // ignore catch block
            }

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

        const createContract = async (ixcContract: IExtendedContractIXC) => {
          const contractProducts = formatIxcContractProductsToContaAzul(
            ixcContract.details.products.items,
          );

          if (contractProducts.length === 0) {
            try {
              await api.post('/logs', {
                date: new Date(),
                ixc_id: `${extendedCustomerIxc.id} - ${extendedCustomerIxc.name}`,
                projection_id: 'Produto não mapeado',
                conta_azul_existing: true,
                discharge_performed: false,
              });
            } catch {
              // ignore catch block
            }

            return;
          }

          await contaAzulContractsCreatePage.navigateTo();

          let always_charge_on_day: number;

          if (isBefore(ixcContract.activation_date, new Date(2020, 10, 13))) {
            if (ixcContract.activation_date.getDate() <= 5) {
              always_charge_on_day = 5;
            } else if (ixcContract.activation_date.getDate() >= 6) {
              always_charge_on_day = ixcContract.activation_date.getDate();
            }
          } else if (ixcContract.activation_date.getDate() <= 26) {
            always_charge_on_day = ixcContract.activation_date.getDate();
          } else if (ixcContract.activation_date.getDate() >= 27) {
            always_charge_on_day = 26;
          }

          await contaAzulContractsCreatePage.create({
            name: contaAzulCustomer.name,
            document: extendedCustomerIxc.document,
            category: 'Vendas',
            sell_date: setDate(ixcContract.activation_date, {
              date: always_charge_on_day + 1,
            }),
            always_charge_on_day,
            products: contractProducts,
            description: `ID Contrato IXC: ${ixcContract.id}`,
          });
        };

        if (contaAzulActiveContracts.length === 0) {
          for (const ixcContract of ixcActiveContracts) {
            await createContract(ixcContract);
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
            ixc: IExtendedContractIXC;
            conta_azul?: IExtendedContractContaAzul;
          }> = [];

          for (const ixcContract of ixcActiveContracts) {
            const contractProducts = formatIxcContractProductsToContaAzul(
              ixcContract.details.products.items,
            );

            const filteredSimilarContaAzulContracts = extendedContaAzulContracts.filter(
              contaAzulContract => {
                const description = contaAzulContract.details.description.toLowerCase();

                if (description.includes('id contrato ixc:')) {
                  const ixcContractId = description
                    .replace('id contrato ixc:', '')
                    .trim();

                  return ixcContractId === ixcContract.id;
                }

                let sell_date: number;

                if (
                  isBefore(ixcContract.activation_date, new Date(2020, 10, 13))
                ) {
                  if (ixcContract.activation_date.getDate() <= 5) {
                    sell_date = 5;
                  } else if (ixcContract.activation_date.getDate() >= 6) {
                    sell_date = ixcContract.activation_date.getDate();
                  }
                } else if (ixcContract.activation_date.getDate() <= 26) {
                  sell_date = ixcContract.activation_date.getDate();
                } else if (ixcContract.activation_date.getDate() >= 27) {
                  sell_date = 26;
                }

                const start_date = setDate(ixcContract.activation_date, {
                  date: sell_date + 1,
                });

                if (
                  contaAzulContract.details.start_date.getDate() !==
                  start_date.getDate()
                ) {
                  return false;
                }

                const checkContainsEveryProduct = contaAzulContract.details.products.every(
                  contaAzulProduct =>
                    contractProducts.some(
                      ixcProduct => ixcProduct.name === contaAzulProduct.name,
                    ),
                );

                if (
                  contaAzulContract.monthly_value ===
                    ixcContract.details.products.gross_value &&
                  checkContainsEveryProduct
                ) {
                  return true;
                }

                const filterCanceledFinancial = ixcContract.details.financial.filter(
                  item =>
                    item.status.includes('Cancelado') &&
                    (item.cancellation_reason.includes('Downgrade') ||
                      item.cancellation_reason.includes('Upgrade')),
                );

                let lastCanceledFinancial: IFinancialItemIXC;

                if (filterCanceledFinancial.length > 0) {
                  lastCanceledFinancial =
                    filterCanceledFinancial[filterCanceledFinancial.length - 1];
                }

                if (
                  lastCanceledFinancial &&
                  contaAzulContract.monthly_value ===
                    lastCanceledFinancial.value
                ) {
                  return true;
                }

                return false;
              },
            );

            if (filteredSimilarContaAzulContracts.length >= 2) {
              try {
                await api.post('/logs', {
                  date: new Date(),
                  ixc_id: `${extendedCustomerIxc.id} - ${extendedCustomerIxc.name}`,
                  projection_id: 'Dois ou mais contratos idênticos',
                  conta_azul_existing: true,
                  discharge_performed: false,
                });
              } catch {
                // ignore catch block
              }

              continue;
            }

            linkedContracts.push({
              ixc: ixcContract,
              conta_azul: filteredSimilarContaAzulContracts[0],
            });
          }

          const contaAzulContractsUpdatePage = new ContaAzulContractsUpdatePage();

          for (const linkedContract of linkedContracts) {
            if (!linkedContract.conta_azul) {
              await createContract(linkedContract.ixc);

              const checkHasCanceledFinancial = linkedContract.ixc.details.financial.some(
                item =>
                  item.status.includes('Cancelado') &&
                  (item.cancellation_reason.includes('Downgrade') ||
                    item.cancellation_reason.includes('Upgrade')),
              );

              if (checkHasCanceledFinancial) {
                try {
                  await api.post('/logs', {
                    date: new Date(),
                    ixc_id: `${extendedCustomerIxc.id} - ${extendedCustomerIxc.name}`,
                    projection_id: `Contrato inexistente no Conta Azul (${linkedContract.ixc.id})`,
                    conta_azul_existing: true,
                    discharge_performed: false,
                  });
                } catch {
                  // ignore catch block
                }
              }
            } else if (
              linkedContract.ixc.details.products.gross_value !==
              linkedContract.conta_azul?.monthly_value
            ) {
              const contractProducts = formatIxcContractProductsToContaAzul(
                linkedContract.ixc.details.products.items,
              );

              await contaAzulContractsUpdatePage.navigateTo(
                linkedContract.conta_azul.details.id,
              );

              await contaAzulContractsUpdatePage.update({
                products: contractProducts,
                description: `ID Contrato IXC: ${linkedContract.ixc.id}`,
              });
            } else if (!linkedContract.conta_azul?.details.description) {
              await contaAzulContractsUpdatePage.navigateTo(
                linkedContract.conta_azul.details.id,
              );

              await contaAzulContractsUpdatePage.update({
                description: `ID Contrato IXC: ${linkedContract.ixc.id}`,
              });
            }
          }
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
          let addressChangeRequest: IContractAdditionalServiceItem;

          const filterReceivedBills = extendedCustomerIxc.details.finances.filter(
            receivedBill => {
              const dateLessThreeDays = subDays(billToReceive.date, 3);
              const dateMoreThreeDays = addDays(billToReceive.date, 3);

              const isDateValid =
                isAfter(receivedBill.due_date, dateLessThreeDays) &&
                isBefore(receivedBill.due_date, dateMoreThreeDays);

              if (!isDateValid) {
                return false;
              }

              if (billToReceive.value !== receivedBill.value) {
                const ixcContract = extendedCustomerIxc.details.contracts.find(
                  contract => contract.id === receivedBill.contract_r,
                );

                if (!ixcContract) {
                  return false;
                }

                const findAddressChangeRequest = ixcContract.details.additional_services.find(
                  item =>
                    item.description
                      .toLowerCase()
                      .includes('mudança de endereço'),
                );

                if (!findAddressChangeRequest) {
                  return false;
                }

                const repeatAmount = findAddressChangeRequest.repeat_amount + 1;

                const isValidMonth = createRangeArray(0, repeatAmount).some(
                  amount => {
                    const dateMoreMonthAmount = addMonths(
                      findAddressChangeRequest.date,
                      amount,
                    );

                    return isSameMonth(
                      receivedBill.due_date,
                      dateMoreMonthAmount,
                    );
                  },
                );

                const valueWithTax =
                  billToReceive.value + findAddressChangeRequest.unit_value;

                if (receivedBill.value === valueWithTax && isValidMonth) {
                  addressChangeRequest = findAddressChangeRequest;

                  return true;
                }

                return false;
              }

              return true;
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

          await contaAzulBillsToReceiveDetailsPage.open({
            bill_to_receive_sell_id: billToReceive.sell_id,
          });

          if (finance.paid_value !== 0.01) {
            let interest = Number(
              (finance.paid_value - finance.value).toFixed(2),
            );

            if (addressChangeRequest) {
              interest += addressChangeRequest.unit_value;
            }

            await contaAzulBillsToReceiveDetailsPage.fillData({
              account: 'Sicoob Crediuna',
              received_date: finance.received_date,
              discount: 0,
              interest,
              paid: finance.paid_value,
              transaction_id: finance.id,
              sell_id: finance.sell_id,
            });
          } else {
            await contaAzulBillsToReceiveDetailsPage.fillData({
              account: 'Sicoob Crediuna',
              received_date: finance.received_date,
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

    const run = async (ixcIds: string[], currentIxcId?: string) => {
      try {
        const browser = await this.browserProvider.launch({ headless });

        const page1 = await browser.newPage();
        const page2 = await browser.newPage();

        container.registerInstance<IBrowser<any, any>>('Browser', browser);

        await browser.run(page1, IXCLogInHandler);
        await browser.run(page2, ContaAzulLogInHandler);

        switchPage(page1);

        const customersMainIxcPage = new CustomersMainIXCPage();

        await customersMainIxcPage.navigateTo();

        let startIndex = 0;

        if (currentIxcId) {
          startIndex = ixcIds.findIndex(id => id === currentIxcId) || 0;
        }

        for (let i = startIndex; i < ixcIds.length; i++) {
          const ixcId = ixcIds[i];

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
      } catch (err) {
        const ixcId = await this.cacheProvider.recover<string>('last-ixc-id');

        const indexOf = ixcIds.findIndex(id => id === ixcId);

        if (ixcIds.length <= indexOf + 1) {
          return;
        }

        let nextIxcId = ixcIds[indexOf + 1];

        const attempts = ixcAttempts[ixcId] || 0;

        console.log();
        console.log(
          'Occurred an unexpected error while processing IXC ID:',
          ixcId,
        );

        if (attempts >= 2) {
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
          console.log(`[${attempts + 1}] Trying again...`);
          console.log();

          nextIxcId = ixcId;
        }

        ixcAttempts[ixcId] = attempts + 1;

        await sleep(5000);

        await run(ixcIds, nextIxcId);
      }
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
    // const ixcIds = ['11559']; // Thiago de Queiroz
    const ixcIds = ['10941']; // Dayane Mendes da Silva Nascimento

    // const ixcIds: string[] = [];

    // for (let i = startIxcId; i < 14430; i++) {
    //   ixcIds.push(String(i));
    // }

    // console.log('IDs:', JSON.stringify(ixcIds));

    // const ixcIds = [
    //   '10863',
    //   '10907',
    //   '10941',
    //   '10949',
    //   '10949',
    //   '10979',
    //   '10981',
    //   '11079',
    //   '11158',
    //   '11212',
    //   '11225',
    //   '11225',
    //   '11262',
    //   '11401',
    //   '11425',
    //   '11558',
    //   '11559',
    //   '11569',
    //   '11582',
    //   '11609',
    //   '11700',
    //   '11719',
    //   '11724',
    //   '11746',
    //   '11776',
    //   '11800',
    //   '11913',
    //   '11981',
    //   '11994',
    //   '12002',
    //   '12040',
    //   '12078',
    //   '12092',
    //   '12104',
    //   '12131',
    //   '12180',
    //   '12196',
    //   '12198',
    //   '12205',
    //   '12208',
    //   '12210',
    //   '12224',
    //   '12230',
    //   '12235',
    //   '12257',
    //   '12374',
    //   '12377',
    //   '12390',
    //   '12392',
    //   '12404',
    //   '12406',
    //   '12417',
    //   '12444',
    //   '12445',
    //   '12459',
    //   '12470',
    //   '12487',
    //   '12508',
    //   '12522',
    //   '12523',
    //   '12529',
    //   '12541',
    //   '12546',
    //   '12572',
    //   '12574',
    //   '12581',
    //   '12582',
    //   '12585',
    //   '12586',
    //   '12588',
    //   '12595',
    //   '12600',
    //   '12606',
    //   '12619',
    //   '12620',
    //   '12630',
    //   '12632',
    //   '12633',
    //   '12635',
    //   '12636',
    //   '12639',
    //   '12641',
    //   '12648',
    //   '12650',
    //   '12661',
    //   '12663',
    //   '12670',
    //   '12671',
    //   '12672',
    //   '12675',
    //   '12688',
    //   '12692',
    //   '12714',
    //   '12717',
    //   '12720',
    //   '12724',
    //   '12736',
    //   '12737',
    //   '12752',
    //   '12757',
    //   '12767',
    //   '12769',
    //   '12776',
    //   '12782',
    //   '12783',
    //   '12791',
    //   '12797',
    //   '12832',
    //   '12835',
    //   '12839',
    //   '12848',
    //   '12870',
    //   '12876',
    //   '12877',
    //   '12885',
    //   '12889',
    //   '12889',
    //   '12893',
    //   '12894',
    //   '12905',
    //   '12921',
    //   '12929',
    //   '12949',
    //   '12952',
    //   '12971',
    //   '12973',
    //   '13002',
    //   '13009',
    //   '13016',
    //   '13034',
    //   '13037',
    //   '13038',
    //   '13050',
    //   '13055',
    //   '13063',
    //   '13069',
    //   '13097',
    //   '13099',
    //   '13112',
    //   '13114',
    //   '13140',
    //   '13142',
    //   '13147',
    //   '13148',
    //   '13171',
    //   '13176',
    //   '13184',
    //   '13193',
    //   '13200',
    //   '13201',
    //   '13213',
    //   '13222',
    //   '13224',
    //   '13229',
    //   '13235',
    //   '13237',
    //   '13246',
    //   '13260',
    //   '13283',
    //   '13291',
    //   '13298',
    //   '13308',
    //   '13318',
    //   '13343',
    //   '13357',
    //   '13370',
    //   '13384',
    //   '13385',
    //   '13388',
    //   '13389',
    //   '13393',
    //   '13397',
    //   '13403',
    //   '13412',
    //   '13414',
    //   '13417',
    //   '13420',
    //   '13429',
    //   '13434',
    //   '13449',
    //   '13453',
    //   '13461',
    //   '13462',
    //   '13488',
    //   '13489',
    //   '13490',
    //   '13491',
    //   '13493',
    //   '13494',
    //   '13525',
    //   '13528',
    //   '13530',
    //   '13534',
    //   '13575',
    //   '13576',
    //   '13577',
    //   '13585',
    //   '13600',
    //   '13627',
    //   '13635',
    //   '13636',
    //   '13654',
    //   '13657',
    //   '13665',
    //   '13667',
    //   '13668',
    //   '13669',
    //   '13670',
    //   '13678',
    //   '13679',
    //   '13681',
    //   '13684',
    //   '13689',
    //   '13722',
    //   '13737',
    //   '13751',
    //   '13769',
    //   '13794',
    //   '13813',
    //   '13817',
    //   '13818',
    //   '13819',
    //   '13819',
    //   '13820',
    //   '13823',
    //   '13825',
    //   '13826',
    //   '13827',
    //   '13830',
    //   '13835',
    //   '13843',
    //   '13845',
    //   '13854',
    //   '13863',
    //   '13872',
    //   '13876',
    //   '13896',
    //   '13896',
    //   '13896',
    //   '13900',
    //   '13945',
    //   '13961',
    //   '13995',
    //   '14019',
    //   '14021',
    //   '14081',
    //   '13900',
    //   '13260',
    // ];

    await run(ixcIds);

    timer.stop();

    const formattedTimer = timer.format();

    console.log('\nReal IXC IDs:', JSON.stringify(ixcRealIds));
    console.log(`\nElapsed time: ${formattedTimer}`);
  }
}
