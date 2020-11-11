import merge from 'lodash/merge';
import { v4 } from 'uuid';

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

  public async create(data: ICreateLogDTO): Promise<Log> {
    const log = new Log();

    merge(log, { id: v4() }, data);

    this.logs.push(log);

    return log;
  }
}

export default FakeLogsRepository;
