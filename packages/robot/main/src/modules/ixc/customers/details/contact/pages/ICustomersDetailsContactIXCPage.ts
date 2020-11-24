import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IContactIXC from '@modules/ixc/customers/details/contact/models/IContactIXC';

export default interface ICustomersDetailsContactIXCPage extends IRobotPage {
  getContactInfo(): Promise<IContactIXC>;
}
