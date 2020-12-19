export default interface IFillBillToReceiveDetailsDataDTO {
  account: string;
  value?: number;
  received_date?: Date;
  discount?: number;
  interest?: number;
  paid?: number;
  transaction_id?: string;
  sell_id?: string;
}
