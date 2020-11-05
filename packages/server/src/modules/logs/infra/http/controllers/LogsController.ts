import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateLogService from '@modules/logs/services/CreateLogService';
import ListLogsService from '@modules/logs/services/ListLogsService';

export default class CustomersIXCController {
  public async index(_request: Request, response: Response): Promise<Response> {
    const listLogs = container.resolve(ListLogsService);

    const logs = await listLogs.execute();

    return response.json(classToClass(logs));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      date,
      ixc_id,
      projection_id,
      conta_azul_existing,
      discharge_performed,
    } = request.body;

    const createLog = container.resolve(CreateLogService);

    const createdCustomerIxc = await createLog.execute({
      date,
      ixc_id,
      projection_id,
      conta_azul_existing,
      discharge_performed,
    });

    return response.json(classToClass(createdCustomerIxc));
  }
}
