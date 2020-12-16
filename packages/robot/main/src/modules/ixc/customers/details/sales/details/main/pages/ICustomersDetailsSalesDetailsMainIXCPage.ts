import ISaleIXC from '@modules/ixc/customers/details/sales/main/models/ISaleIXC';

export default interface ICustomersDetailsSalesDetailsMainIXCPage {
  open(sale: ISaleIXC): Promise<void>;
  close(): Promise<void>;
}
