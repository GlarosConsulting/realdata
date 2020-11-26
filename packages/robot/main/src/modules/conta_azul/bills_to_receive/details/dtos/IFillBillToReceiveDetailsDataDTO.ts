export default interface IFillBillToReceiveDetailsDataDTO {
  account: string;
  received_date: string;
  discount: number;
  interest: number;
  paid: number;
  transaction_id: string;
  sell_id: string;
}
