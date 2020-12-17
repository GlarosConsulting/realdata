export default interface IFinancialItemIXC {
  id: string;
  status: string;
  charge: number;
  contract_r: string;
  installment_r: number;
  contract_a: string;
  sell_id: string;
  emission_date: Date;
  due_date: Date;
  value: number;
  received_value: number;
  open_value: number;
  paid_value: number;
  payment_date: Date;
  credit_date: Date;
  received_date: Date;
  type: string;
  cancellation_date: Date;
  cancellation_reason: string;
}
