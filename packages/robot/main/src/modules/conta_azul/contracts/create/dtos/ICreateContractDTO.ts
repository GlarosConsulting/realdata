import IContractProductItemContaAzul from '@modules/conta_azul/contracts/create/models/IContractProductItemContaAzul';

export default interface ICreateContractDTO {
  document: string;
  category: string;
  sell_date: string;
  always_charge_on_day: number;
  products: IContractProductItemContaAzul[];
}
