import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import ISaleProductItem from '@modules/ixc/customers/details/sales/details/products/models/ISaleProductItem';

export default interface ICustomersDetailsSalesDetailsProductsIXCPage
  extends IRobotPage {
  getAll(): Promise<ISaleProductItem[]>;
}
