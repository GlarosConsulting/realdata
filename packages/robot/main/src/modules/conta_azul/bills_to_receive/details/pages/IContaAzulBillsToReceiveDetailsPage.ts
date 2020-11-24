import IFillBillToReceiveDetailsDataDTO from '../dtos/IFillBillToReceiveDetailsDataDTO';
import IOpenBillToReceiveDetailsDTO from '../dtos/IOpenBillToReceiveDetailsDTO';

export default interface IContaAzulBillsToReceiveDetailsPage {
  open(data: IOpenBillToReceiveDetailsDTO): Promise<void>;
  fillData(data: IFillBillToReceiveDetailsDataDTO): Promise<void>;
}
