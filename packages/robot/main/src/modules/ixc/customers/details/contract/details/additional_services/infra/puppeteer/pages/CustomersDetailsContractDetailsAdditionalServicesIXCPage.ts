import { container } from 'tsyringe';

import IContractAdditionalServiceItem from '@modules/ixc/customers/details/contract/details/additional_services/models/IContractAdditionalServiceItem';
import ICustomersDetailsContractDetailsAdditionalServicesIXCPage from '@modules/ixc/customers/details/contract/details/additional_services/pages/ICustomersDetailsContractDetailsAdditionalServicesIXCPage';
import ExtractAdditionalServiceListService from '@modules/ixc/customers/details/contract/details/additional_services/services/ExtractAdditionalServiceListService';
import NavigateToAdditionalServicesTabService from '@modules/ixc/customers/details/contract/details/additional_services/services/NavigateToAdditionalServicesTabService';

class CustomersDetailsContractDetailsAdditionalServicesIXCPage
  implements ICustomersDetailsContractDetailsAdditionalServicesIXCPage {
  public async navigateTo(): Promise<void> {
    const navigateToAdditionalServicesTab = container.resolve(
      NavigateToAdditionalServicesTabService,
    );

    await navigateToAdditionalServicesTab.execute();
  }

  public async getAll(): Promise<IContractAdditionalServiceItem[]> {
    const extractAdditionalServiceList = container.resolve(
      ExtractAdditionalServiceListService,
    );

    const additionalServices = await extractAdditionalServiceList.execute();

    return additionalServices;
  }
}

export default CustomersDetailsContractDetailsAdditionalServicesIXCPage;
