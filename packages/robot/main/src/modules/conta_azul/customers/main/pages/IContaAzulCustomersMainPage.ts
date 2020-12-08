import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import ICustomerContaAzul from '@modules/conta_azul/customers/main/models/ICustomerContaAzul';

import IFindCustomerByFieldDTO from '../dtos/IFindCustomerByFieldDTO';

export default interface IContaAzulCustomersMainPage extends IRobotPage {
  getAll(): Promise<ICustomerContaAzul[]>;
  findByField(data: IFindCustomerByFieldDTO): Promise<ICustomerContaAzul>;
  disable(customerName: string): Promise<void>;
}
