import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IContractProducts from '@modules/ixc/customers/details/contract/details/products/models/IContractProducts';

export default interface ICustomersDetailsContractDetailsProductsIXCPage
  extends IRobotPage {
  getData(): Promise<IContractProducts>;
}
