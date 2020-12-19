import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IFinancialItemIXC from '@modules/ixc/customers/details/financial/models/IFinancialItemIXC';

export default interface ICustomersDetailsContractDetailsDetachedFinancialIXCPage
  extends IRobotPage {
  getAll(): Promise<IFinancialItemIXC[]>;
}
