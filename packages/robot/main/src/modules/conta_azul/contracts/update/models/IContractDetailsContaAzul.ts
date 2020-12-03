import IContractProductItemContaAzul from '@modules/conta_azul/contracts/create/models/IContractProductItemContaAzul';

export default interface IContractDetailsContaAzul {
  start_date: Date;
  next_billing_date: Date;
  frequency: string;
  charging: string;
  remaining_validity: string;
  products: IContractProductItemContaAzul[];
}
