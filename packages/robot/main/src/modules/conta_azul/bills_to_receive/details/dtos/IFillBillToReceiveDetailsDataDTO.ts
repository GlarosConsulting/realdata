export default interface IFillBillToReceiveDetailsDataDTO {
  account: string;
  received_date: Date;
  discount: number;
  interest: number;
  value?: number;
  paid: number;
  transaction_id: string;
  sell_id: string;
}
