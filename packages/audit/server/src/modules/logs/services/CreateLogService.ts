import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Log from '../infra/typeorm/entities/Log';
import ILogsRepository from '../repositories/ILogsRepository';

interface IRequest {
  date: Date;
  ixc_id: string;
  projection_id: string;
  conta_azul_existing: boolean;
  discharge_performed: boolean;
}

@injectable()
export default class CreateLogService {
  constructor(
    @inject('LogsRepository')
    private logsRepository: ILogsRepository,
  ) {}

  public async execute({
    date,
    ixc_id,
    projection_id,
    conta_azul_existing,
    discharge_performed,
  }: IRequest): Promise<Log> {
    const checkExists = await this.logsRepository.checkExistsByIxcIdAndProjectionId(
      {
        ixc_id,
        projection_id,
      },
    );

    if (checkExists) {
      throw new AppError('Duplicated log.');
    }

    const log = await this.logsRepository.create({
      date,
      ixc_id,
      projection_id,
      conta_azul_existing,
      discharge_performed,
    });

    return log;
  }
}
