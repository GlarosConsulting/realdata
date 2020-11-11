import { getRepository, Repository } from 'typeorm';

import ICreateLogDTO from '@modules/logs/dtos/ICreateLogDTO';
import ILogsRepository from '@modules/logs/repositories/ILogsRepository';

import Log from '../entities/Log';

class LogsRepository implements ILogsRepository {
  private ormRepository: Repository<Log>;

  constructor() {
    this.ormRepository = getRepository(Log);
  }

  public async findAll(): Promise<Log[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<Log | undefined> {
    const log = await this.ormRepository.findOne(id);

    return log;
  }

  public async create(data: ICreateLogDTO): Promise<Log> {
    const log = this.ormRepository.create(data);

    await this.ormRepository.save(log);

    return log;
  }
}

export default LogsRepository;
