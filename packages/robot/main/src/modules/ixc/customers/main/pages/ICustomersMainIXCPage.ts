import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IFindCustomerByFieldDTO from '@modules/ixc/customers/main/dtos/IFindCustomerByFieldDTO';
import ICustomerIXC from '@modules/ixc/customers/main/models/ICustomerIXC';

export default interface ICustomersMainIXCPage extends IRobotPage {
  getAll(): Promise<ICustomerIXC[]>;
  findByField(data: IFindCustomerByFieldDTO): Promise<ICustomerIXC>;
}
