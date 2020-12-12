import IAddressIXC from '@modules/ixc/customers/details/address/models/IAddressIXC';
import IContactIXC from '@modules/ixc/customers/details/contact/models/IContactIXC';
import IFinancialItemIXC from '@modules/ixc/customers/details/financial/models/IFinancialItemIXC';
import IMainDetailsIXC from '@modules/ixc/customers/details/main/models/IMainDetailsIXC';
import ICustomerIXC from '@modules/ixc/customers/main/models/ICustomerIXC';

import IExtendedContractIXC from './IExtendedContractIXC';

export default interface IExtendedCustomerIXC extends ICustomerIXC {
  details: {
    main: IMainDetailsIXC;
    address: IAddressIXC;
    contact: IContactIXC;
    finances: IFinancialItemIXC[];
    contracts: IExtendedContractIXC[];
  };
}
