import { inject, injectable } from 'tsyringe';

import { IHandler } from '@robot/shared/modules/browser/models/IBrowser';

import IConfigurationProvider from '@shared/container/providers/ConfigurationProvider/models/IConfigurationProvider';

import ContaAzulBillsToReceiveDetailsPage from '@modules/conta_azul/bills_to_receive/details/infra/puppeteer/pages/ContaAzulBillsToReceiveDetailsPage';

@injectable()
class ContaAzulBillsToReceiveDetailsHandler implements IHandler {
  constructor(
    @inject('ConfigurationProvider')
    private configurationProvider: IConfigurationProvider,
  ) {}

  public async handle(): Promise<void> {
    const contaAzulBillsToReceiveDetailsPage = new ContaAzulBillsToReceiveDetailsPage();

    await contaAzulBillsToReceiveDetailsPage.open({
      bill_to_receive_sell_id: '123',
    });
  }
}

export default ContaAzulBillsToReceiveDetailsHandler;
