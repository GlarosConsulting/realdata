import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IFinanceIXC from '@modules/ixc/customers/details/finance/models/IFinanceIXC';

export default interface ICustomersDetailsFinanceIXCPage extends IRobotPage {
  getAll(): Promise<IFinanceIXC[]>;
}
