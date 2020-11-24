import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IAddressIXC from '@modules/ixc/customers/details/address/models/IAddressIXC';

export default interface ICustomersDetailsAddressIXCPage extends IRobotPage {
  getAddressInfo(): Promise<IAddressIXC>;
}
