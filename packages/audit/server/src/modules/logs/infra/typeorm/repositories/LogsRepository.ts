import { getRepository, Repository } from 'typeorm';

import ICheckExistsByIxcIdAndProjectionId from '@modules/logs/dtos/ICheckExistsByIxcIdAndProjectionId';
import ICreateLogDTO from '@modules/logs/dtos/ICreateLogDTO';
import ILogsRepository from '@modules/logs/repositories/ILogsRepository';

import Log from '../entities/Log';

class LogsRepository implements ILogsRepository {
  private ormRepository: Repository<Log>;

  constructor() {
    this.ormRepository = getRepository(Log);
  }

  public async findAll(): Promise<Log[]> {
    return this.ormRepository.find({
      order: {
        created_at: 'ASC',
      },
    });
  }

  public async findById(id: string): Promise<Log | undefined> {
    const log = await this.ormRepository.findOne(id);

    return log;
  }

  public async checkExistsByIxcIdAndProjectionId({
    ixc_id,
    projection_id,
  }: ICheckExistsByIxcIdAndProjectionId): Promise<boolean> {
    const countByIxcIdAndProjectionId = await this.ormRepository.count({
      where: {
        ixc_id,
        projection_id,
      },
    });

    return countByIxcIdAndProjectionId > 0;
  }

  public async create(data: ICreateLogDTO): Promise<Log> {
    const log = this.ormRepository.create(data);

    await this.ormRepository.save(log);

    return log;
  }

  public async save(log: Log): Promise<Log> {
    return this.ormRepository.save(log);
  }
}

export default LogsRepository;
