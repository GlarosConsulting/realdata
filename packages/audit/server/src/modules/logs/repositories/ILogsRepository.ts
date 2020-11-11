import ICreateLogDTO from '../dtos/ICreateLogDTO';
import Log from '../infra/typeorm/entities/Log';

export default interface ILogsRepository {
  findAll(): Promise<Log[]>;
  findById(id: string): Promise<Log | undefined>;
  create(data: ICreateLogDTO): Promise<Log>;
}
