import { PERSON_TYPES } from '@modules/conta_azul/customers/create/services/FillCreateCustomerDataService';

export default interface ICreateCustomerDTO {
  person_type: keyof typeof PERSON_TYPES;
  document: string;
  name: string;
  fantasy_name: string;
  ixc_id: string;
  additional_info: {
    email: string;
    phone_commercial: string;
    phone_mobile: string;
    birth_date: string;
    identity: string;
  };
  address: {
    cep: string;
    number: string;
    complement: string;
  };
}
