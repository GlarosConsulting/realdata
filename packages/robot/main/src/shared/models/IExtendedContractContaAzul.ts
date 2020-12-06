import IContractDetailsContaAzul from '@modules/conta_azul/contracts/details/models/IContractDetailsContaAzul';
import IContractContaAzul from '@modules/conta_azul/contracts/main/models/IContractContaAzul';

export default interface IExtendedContractContaAzul extends IContractContaAzul {
  details: IContractDetailsContaAzul;
}
