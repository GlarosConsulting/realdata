import IContractAdditionalServiceItem from '@modules/ixc/customers/details/contract/details/additional_services/models/IContractAdditionalServiceItem';
import IContractProducts from '@modules/ixc/customers/details/contract/details/products/models/IContractProducts';
import IContractIXC from '@modules/ixc/customers/details/contract/main/models/IContractIXC';
import IFinancialItemIXC from '@modules/ixc/customers/details/financial/models/IFinancialItemIXC';

export default interface IExtendedContractIXC extends IContractIXC {
  details: {
    products: IContractProducts;
    additional_services: IContractAdditionalServiceItem[];
    financial: IFinancialItemIXC[];
    detached_financial: IFinancialItemIXC[];
  };
}
