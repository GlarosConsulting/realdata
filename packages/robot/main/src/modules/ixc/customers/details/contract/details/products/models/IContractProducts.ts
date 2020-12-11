export interface IContractProductItem {
  id: string;
  description: string;
  plan: string;
  service: string;
  amount: number;
  unit_value: number;
  gross_value: number;
  net_value: number;
  contract_id: string;
}

export default interface IContractProducts {
  gross_value: number;
  net_value: number;
  items: IContractProductItem[];
}
