import { container } from 'tsyringe';

import IFindBillsToPayByFieldDTO from '@modules/conta_azul/bills_to_receive/main/dtos/IFindBillsToPayByFieldDTO';
import IBillToReceive from '@modules/conta_azul/bills_to_receive/main/models/IBillToReceive';
import IContaAzulBillToReceiveMainPage from '@modules/conta_azul/bills_to_receive/main/pages/IContaAzulBillToReceiveMainPage';
import ExtractBillsToReceiveListService from '@modules/conta_azul/bills_to_receive/main/services/ExtractBillsToReceiveListService';
import FindBillsToReceiveByFieldService from '@modules/conta_azul/bills_to_receive/main/services/FindBillsToReceiveByFieldService';
import NavigateToBillsToReceivePageService from '@modules/conta_azul/bills_to_receive/main/services/NavigateToBillsToReceivePageService';

class ContaAzulBillToReceiveMainPage
  implements IContaAzulBillToReceiveMainPage {
  public async navigateTo(): Promise<void> {
    const navigateToBillsToReceivePage = container.resolve(
      NavigateToBillsToReceivePageService,
    );

    await navigateToBillsToReceivePage.execute();
  }

  public async getAll(): Promise<IBillToReceive[]> {
    const extractBillsToReceiveList = container.resolve(
      ExtractBillsToReceiveListService,
    );

    const billsToPay = await extractBillsToReceiveList.execute();

    return billsToPay;
  }

  public async findByField({
    field,
    value,
  }: IFindBillsToPayByFieldDTO): Promise<IBillToReceive[]> {
    const findBillsToReceiveByField = container.resolve(
      FindBillsToReceiveByFieldService,
    );

    const billsToPay = findBillsToReceiveByField.execute({ field, value });

    return billsToPay;
  }
}

export default ContaAzulBillToReceiveMainPage;
