import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IFinancialItemIXC from '@modules/ixc/customers/details/financial/models/IFinancialItemIXC';

export default interface ICustomersDetailsContractDetailsFinancialIXCPage
  extends IRobotPage {
  getAll(): Promise<IFinancialItemIXC[]>;
}
