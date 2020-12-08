import IContractProductItemContaAzul from '@modules/conta_azul/contracts/create/models/IContractProductItemContaAzul';

export default interface IContractDetailsContaAzul {
  id: string;
  start_date: Date;
  next_billing_date: Date;
  frequency: string;
  charging: string;
  remaining_validity: string;
  description: string;
  products: IContractProductItemContaAzul[];
}
