import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IContractIXC from '@modules/ixc/customers/details/contract/main/models/IContractIXC';

export default interface ICustomersDetailsContractMainIXCPage
  extends IRobotPage {
  getAll(): Promise<IContractIXC[]>;
}
