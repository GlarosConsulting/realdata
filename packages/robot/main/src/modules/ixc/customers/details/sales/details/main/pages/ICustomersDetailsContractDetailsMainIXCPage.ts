import IContractIXC from '@modules/ixc/customers/details/contract/main/models/IContractIXC';

export default interface ICustomersDetailsContractDetailsMainIXCPage {
  open(contract: IContractIXC): Promise<void>;
  close(): Promise<void>;
}
