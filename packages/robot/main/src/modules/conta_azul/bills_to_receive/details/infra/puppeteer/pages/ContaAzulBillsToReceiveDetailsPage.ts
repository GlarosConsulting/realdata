import { container } from 'tsyringe';

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
  }: IFillBillToReceiveDetailsDataDTO): Promise<void> {
    const fillBillToReceiveDetailsData = container.resolve(
      FillBillToReceiveDetailsDataService,
    );

    await fillBillToReceiveDetailsData.execute({ account });
  }
}

export default ContaAzulBillsToReceiveDetailsPage;
