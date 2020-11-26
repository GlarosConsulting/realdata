import { FIELDS } from '@modules/conta_azul/customers/main/services/FindCustomerByFieldService';

export default interface IFindCustomerByFieldDTO {
  field: keyof typeof FIELDS;
  value: string;
}
