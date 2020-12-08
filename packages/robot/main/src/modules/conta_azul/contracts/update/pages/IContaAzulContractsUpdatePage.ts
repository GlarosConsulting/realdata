import IUpdateContractDTO from '@modules/conta_azul/contracts/update/dtos/IUpdateContractDTO';

export default interface IContaAzulContractsUpdatePage {
  navigateTo(contract_id?: string): Promise<void>;
  update(data: IUpdateContractDTO): Promise<void>;
}
