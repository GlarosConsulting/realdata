export default interface IBillToPay {
  expired: boolean;
  date: Date;
  value: number;
  launch: {
    type: string;
    customer_name: string;
  };
}
