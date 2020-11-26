import IAddressIXC from '@modules/ixc/customers/details/address/models/IAddressIXC';
import IContactIXC from '@modules/ixc/customers/details/contact/models/IContactIXC';
import IFinanceIXC from '@modules/ixc/customers/details/finance/models/IFinanceIXC';
import IMainDetailsIXC from '@modules/ixc/customers/details/main/models/IMainDetailsIXC';
import ICustomerIXC from '@modules/ixc/customers/main/models/ICustomerIXC';

export default interface IExtendedCustomerIXC extends ICustomerIXC {
  details: {
    main: IMainDetailsIXC;
    address: IAddressIXC;
    contact: IContactIXC;
    finances: IFinanceIXC[];
    contracts: IContractIXC[];
  };
}
