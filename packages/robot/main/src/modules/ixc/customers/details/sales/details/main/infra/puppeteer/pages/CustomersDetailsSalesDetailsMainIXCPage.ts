import { container } from 'tsyringe';

import ICustomersDetailsSalesDetailsMainIXCPage from '@modules/ixc/customers/details/sales/details/main/pages/ICustomersDetailsSalesDetailsMainIXCPage';
import CloseSaleDetailsService from '@modules/ixc/customers/details/sales/details/main/services/CloseSaleDetailsService';
import OpenSaleDetailsService from '@modules/ixc/customers/details/sales/details/main/services/OpenSaleDetailsService';
import ISaleIXC from '@modules/ixc/customers/details/sales/main/models/ISaleIXC';

class CustomersDetailsSalesDetailsMainIXCPage
  implements ICustomersDetailsSalesDetailsMainIXCPage {
  public async open(sale: ISaleIXC): Promise<void> {
    const openSaleDetails = container.resolve(OpenSaleDetailsService);

    await openSaleDetails.execute({ sale });
  }

  public async close(): Promise<void> {
    const closeSaleDetails = container.resolve(CloseSaleDetailsService);

    await closeSaleDetails.execute();
  }
}

export default CustomersDetailsSalesDetailsMainIXCPage;
