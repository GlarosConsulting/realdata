import { container } from 'tsyringe';

import contaAzulConfig from '@config/conta_azul';

import IFillBillToReceiveDetailsDataDTO from '@modules/conta_azul/bills_to_receive/details/dtos/IFillBillToReceiveDetailsDataDTO';
import IOpenBillToReceiveDetailsDTO from '@modules/conta_azul/bills_to_receive/details/dtos/IOpenBillToReceiveDetailsDTO';
import IContaAzulBillsToReceiveDetailsPage from '@modules/conta_azul/bills_to_receive/details/pages/IContaAzulBillsToReceiveDetailsPage';
import FillBillToReceiveDetailsDataService from '@modules/conta_azul/bills_to_receive/details/services/FillBillToReceiveDetailsDataService';
import OpenBillToReceiveDetailsService from '@modules/conta_azul/bills_to_receive/details/services/OpenBillToReceiveDetailsService';

class ContaAzulBillsToReceiveDetailsPage
  implements IContaAzulBillsToReceiveDetailsPage {
  public async open({
    bill_to_receive_sell_id,
  }: IOpenBillToReceiveDetailsDTO): Promise<void> {
    const openBillToReceiveDetails = container.resolve(
      OpenBillToReceiveDetailsService,
    );

    await openBillToReceiveDetails.execute({ bill_to_receive_sell_id });
  }

  public async fillData({
    account,
    received_date,
    discount,
    interest,
    value,
    paid,
    transaction_id,
    sell_id,
  }: IFillBillToReceiveDetailsDataDTO): Promise<void> {
    const fillBillToReceiveDetailsData = container.resolve(
      FillBillToReceiveDetailsDataService,
    );

    await fillBillToReceiveDetailsData.execute(
      {
        account,
        received_date,
        discount,
        interest,
        value,
        paid,
        transaction_id,
        sell_id,
      },
      contaAzulConfig.testing.dont_save,
    );
  }
}

export default ContaAzulBillsToReceiveDetailsPage;
