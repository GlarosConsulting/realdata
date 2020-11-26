import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IContractIXC from '@modules/ixc/customers/details/contract/models/IContractIXC';

export default interface ICustomersDetailsContractXCPage extends IRobotPage {
  getAll(): Promise<IContractIXC[]>;
}
