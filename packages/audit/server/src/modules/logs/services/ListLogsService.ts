import { injectable, inject } from 'tsyringe';

import Log from '../infra/typeorm/entities/Log';
import ILogsRepository from '../repositories/ILogsRepository';

@injectable()
export default class ListCustomersIXCService {
  constructor(
    @inject('LogsRepository')
    private logsRepository: ILogsRepository,
  ) {}

  public async execute(): Promise<Log[]> {
    const logs = await this.logsRepository.findAll();

    return logs;
  }
}
