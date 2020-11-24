import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IBillToReceive from '@modules/conta_azul/bills_to_receive/main/models/IBillToReceive';

import IFindBillsToPayByFieldDTO from '../dtos/IFindBillsToPayByFieldDTO';

export default interface IContaAzulBillToReceiveMainPage extends IRobotPage {
  getAll(): Promise<IBillToReceive[]>;
  findByField(data: IFindBillsToPayByFieldDTO): Promise<IBillToReceive[]>;
}
