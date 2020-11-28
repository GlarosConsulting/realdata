import { merge } from 'lodash';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Log from '../infra/typeorm/entities/Log';
import ILogsRepository from '../repositories/ILogsRepository';

interface IRequest {
  log_id: string;
  discharge_performed: boolean;
}

@injectable()
export default class UpdateLogDischargePerformedService {
  constructor(
    @inject('LogsRepository')
    private logsRepository: ILogsRepository,
  ) {}

  public async execute({
    log_id,
    discharge_performed,
  }: IRequest): Promise<Log> {
    const log = await this.logsRepository.findById(log_id);

    if (!log) {
      throw new AppError('Log not found.');
    }

    merge(log, { discharge_performed });

    await this.logsRepository.save(log);

    return log;
  }
}
