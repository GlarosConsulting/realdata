import { FIELDS } from '@modules/conta_azul/bills_to_receive/main/services/FindBillsToReceiveByFieldService';

export default interface IFindBillsToPayByFieldDTO {
  field: keyof typeof FIELDS;
  value: string;
}
