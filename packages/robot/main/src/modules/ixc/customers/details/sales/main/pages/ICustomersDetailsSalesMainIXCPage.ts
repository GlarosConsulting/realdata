import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import ISaleIXC from '@modules/ixc/customers/details/sales/main/models/ISaleIXC';

export default interface ICustomersDetailsSalesMainIXCPage extends IRobotPage {
  getAll(): Promise<ISaleIXC[]>;
}
