import { container } from 'tsyringe';

import IContactIXC from '@modules/ixc/customers/details/contact/models/IContactIXC';
import ICustomersDetailsContactIXCPage from '@modules/ixc/customers/details/contact/pages/ICustomersDetailsContactIXCPage';
import ExtractContactInfoService from '@modules/ixc/customers/details/contact/services/ExtractContactInfoService';
import NavigateToContactTabService from '@modules/ixc/customers/details/contact/services/NavigateToContactTabService';

class CustomersDetailsContactIXCPage
  implements ICustomersDetailsContactIXCPage {
  public async navigateTo(): Promise<void> {
    const navigateToContactTab = container.resolve(NavigateToContactTabService);

    await navigateToContactTab.execute();
  }

  public async getContactInfo(): Promise<IContactIXC> {
    const extractContactInfo = container.resolve(ExtractContactInfoService);

    const contactInfo = await extractContactInfo.execute();

    return contactInfo;
  }
}

export default CustomersDetailsContactIXCPage;
