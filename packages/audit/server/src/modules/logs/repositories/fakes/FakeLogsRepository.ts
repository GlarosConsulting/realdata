import merge from 'lodash/merge';
import { v4 } from 'uuid';

import ICheckExistsByIxcIdAndProjectionId from '@modules/logs/dtos/ICheckExistsByIxcIdAndProjectionId';

import ICreateLogDTO from '../../dtos/ICreateLogDTO';
import Log from '../../infra/typeorm/entities/Log';
import ILogsRepository from '../ILogsRepository';

class FakeLogsRepository implements ILogsRepository {
  private logs: Log[] = [];

  public async findAll(): Promise<Log[]> {
    return this.logs;
  }

  public async findById(id: string): Promise<Log | undefined> {
    const findLog = this.logs.find(log => log.id === id);

    return findLog;
  }

  public async checkExistsByIxcIdAndProjectionId({
    ixc_id,
    projection_id,
  }: ICheckExistsByIxcIdAndProjectionId): Promise<boolean> {
    const someByIxcIdAndProjectionId = this.logs.some(
      log => log.ixc_id === ixc_id && log.projection_id === projection_id,
    );

    return someByIxcIdAndProjectionId;
  }

  public async create(data: ICreateLogDTO): Promise<Log> {
    const log = new Log();

    merge(log, { id: v4() }, data);

    this.logs.push(log);

    return log;
  }

  public async save(log: Log): Promise<Log> {
    const findIndex = this.logs.findIndex(findLog => findLog.id === log.id);

    this.logs[findIndex] = log;

    return log;
  }
}

export default FakeLogsRepository;
