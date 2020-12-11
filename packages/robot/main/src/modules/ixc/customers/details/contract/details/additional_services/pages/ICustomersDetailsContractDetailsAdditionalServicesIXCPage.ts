import IRobotPage from '@shared/puppeteer/pages/IRobotPage';

import IContractAdditionalServiceItem from '@modules/ixc/customers/details/contract/details/additional_services/models/IContractAdditionalServiceItem';

export default interface ICustomersDetailsContractDetailsAdditionalServicesIXCPage
  extends IRobotPage {
  getAll(): Promise<IContractAdditionalServiceItem[]>;
}
