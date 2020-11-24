import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import ICreateCustomerDTO from '../dtos/ICreateCustomerDTO';

export default interface IContaAzulCustomersCreatePage extends IRobotPage {
  create(data: ICreateCustomerDTO): Promise<void>;
}
