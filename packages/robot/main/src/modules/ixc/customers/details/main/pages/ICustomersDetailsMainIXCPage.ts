import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IMainDetailsIXC from '@modules/ixc/customers/details/main/models/IMainDetailsIXC';

import IOpenCustomerDetailsDTO from '../dtos/IOpenCustomerDetailsDTO';

export default interface ICustomersDetailsMainIXCPage extends IRobotPage {
  open(data: IOpenCustomerDetailsDTO): Promise<void>;
  getMainDetails(): Promise<IMainDetailsIXC>;
}
