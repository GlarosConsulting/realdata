import IContractProducts from '@modules/ixc/customers/details/contract/models/IContractProducts';

export default interface IContractIXC {
  id: string;
  fil: string;
  status: boolean;
  access_status: boolean;
  customer_name: string;
  activation_date: Date;
  base_date: Date;
  type: string;
  description: string;
  products: IContractProducts;
}
