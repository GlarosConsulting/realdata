import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateLogDischargePerformedService from '@modules/logs/services/UpdateLogDischargePerformedService';

export default class CustomersIXCController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { log_id } = request.params;
    const { discharge_performed } = request.body;

    const updateLogDischargePerformed = container.resolve(
      UpdateLogDischargePerformedService,
    );

    const updatedLog = await updateLogDischargePerformed.execute({
      log_id,
      discharge_performed,
    });

    return response.json(classToClass(updatedLog));
  }
}
