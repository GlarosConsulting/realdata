export default interface IBillToPay {
  expired: boolean;
  date: Date;
  value: number;
  sell_id: string;
  launch: {
    type: string;
    customer_name: string;
  };
}
