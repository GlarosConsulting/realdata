export default interface ICreateTaskDTO {
  date: Date;
  ixc_id: string;
  projection_id: string;
  conta_azul_existing: boolean;
  discharge_performed: boolean;
}
