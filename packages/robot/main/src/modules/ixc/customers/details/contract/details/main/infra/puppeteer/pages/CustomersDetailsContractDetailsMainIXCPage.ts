import { container } from 'tsyringe';

import ICustomersDetailsContractDetailsMainIXCPage from '@modules/ixc/customers/details/contract/details/main/pages/ICustomersDetailsContractDetailsMainIXCPage';
import CloseContractDetailsService from '@modules/ixc/customers/details/contract/details/main/services/CloseContractDetailsService';
import OpenContractDetailsService from '@modules/ixc/customers/details/contract/details/main/services/OpenContractDetailsService';
import IContractIXC from '@modules/ixc/customers/details/contract/main/models/IContractIXC';

class CustomersDetailsContractDetailsMainIXCPage
  implements ICustomersDetailsContractDetailsMainIXCPage {
  public async open(contract: IContractIXC): Promise<void> {
    const openContractDetails = container.resolve(OpenContractDetailsService);

    await openContractDetails.execute({ contract });
  }

  public async close(): Promise<void> {
    const closeContractDetails = container.resolve(CloseContractDetailsService);

    await closeContractDetails.execute();
  }
}

export default CustomersDetailsContractDetailsMainIXCPage;
