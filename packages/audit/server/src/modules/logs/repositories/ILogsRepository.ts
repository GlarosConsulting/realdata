import ICheckExistsByIxcIdAndProjectionId from '@modules/logs/dtos/ICheckExistsByIxcIdAndProjectionId';

import ICreateLogDTO from '../dtos/ICreateLogDTO';
import Log from '../infra/typeorm/entities/Log';

export default interface ILogsRepository {
  findAll(): Promise<Log[]>;
  findById(id: string): Promise<Log | undefined>;
  checkExistsByIxcIdAndProjectionId(
    data: ICheckExistsByIxcIdAndProjectionId,
  ): Promise<boolean>;
  create(data: ICreateLogDTO): Promise<Log>;
  save(log: Log): Promise<Log>;
}
