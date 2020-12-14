export default interface ISaleIXC {
  id: string;
  branch: string;
  nf: string;
  doc_type: string;
  emission_date: Date;
  departure_date: Date;
  customer_name: string;
  value: number;
  status: string;
  printed: boolean;
  seller_name: string;
  contract_r: string;
  contract_a: string;
  document: string;
}
