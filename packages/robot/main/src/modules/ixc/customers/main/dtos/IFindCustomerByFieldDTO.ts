import { FIELDS } from '@modules/ixc/customers/main/services/FindCustomerByFieldService';

export default interface IFindCustomerByFieldDTO {
  field: keyof typeof FIELDS;
  value: string;
}
