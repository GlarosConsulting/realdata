export default interface IBillToReceive {
  expired: boolean;
  date: Date;
  value: number;
  sell_id: string;
  launch: {
    type: string;
    customer_name: string;
  };
}
