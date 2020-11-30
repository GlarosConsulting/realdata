import IExtendedCustomerIXC from '@shared/models/IExtendedCustomerIXC';

export default class ProcessingContaAzulError {
  public readonly ixc: IExtendedCustomerIXC;

  constructor(ixc: IExtendedCustomerIXC) {
    this.ixc = ixc;
  }
}
