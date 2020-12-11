export default interface IContractAdditionalServiceItem {
  id: string;
  date: Date;
  contract: string;
  product: string;
  description: string;
  amount: number;
  unit_value: number;
  total_value: number;
  repeat: string;
  repeat_amount: number;
  status: string;
  executions: number;
}
