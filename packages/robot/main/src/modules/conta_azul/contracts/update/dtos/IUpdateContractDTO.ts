import IContractProductItemContaAzul from '@modules/conta_azul/contracts/create/models/IContractProductItemContaAzul';

export default interface IUpdateContractDTO {
  products?: IContractProductItemContaAzul[];
  description?: string;
}
