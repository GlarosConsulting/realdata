import { inject, injectable } from 'tsyringe';

import { IHandler } from '@robot/shared/modules/browser/models/IBrowser';

import IConfigurationProvider from '@shared/container/providers/ConfigurationProvider/models/IConfigurationProvider';

import ContaAzulBillToReceiveMainPage from '@modules/conta_azul/bills_to_receive/main/infra/puppeteer/pages/ContaAzulBillToReceiveMainPage';

@injectable()
class ContaAzulBillsToReceiveMainHandler implements IHandler {
  constructor(
    @inject('ConfigurationProvider')
    private configurationProvider: IConfigurationProvider,
  ) {}

  public async handle(): Promise<void> {
    const contaAzulBillToReceiveMainPage = new ContaAzulBillToReceiveMainPage();

    await contaAzulBillToReceiveMainPage.navigateTo();

    const billsToReceive = contaAzulBillToReceiveMainPage.getAll();

    console.log(billsToReceive);
  }
}

export default ContaAzulBillsToReceiveMainHandler;
