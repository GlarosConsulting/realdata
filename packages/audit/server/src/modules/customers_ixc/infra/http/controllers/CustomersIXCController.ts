import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCustomerIXCService from '@modules/customers_ixc/services/CreateCustomerIXCService';
import ListCustomersIXCService from '@modules/customers_ixc/services/ListCustomersIXCService';

export default class CustomersIXCController {
  public async index(_request: Request, response: Response): Promise<Response> {
    const listCustomersIxc = container.resolve(ListCustomersIXCService);

    const customersIxc = await listCustomersIxc.execute();

    return response.json(classToClass(customersIxc));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { ixc_id, ixc_name, conta_azul_name, status } = request.body;

    const createCustomerIxc = container.resolve(CreateCustomerIXCService);

    const createdCustomerIxc = await createCustomerIxc.execute({
      ixc_id,
      ixc_name,
      conta_azul_name,
      status,
    });

    return response.json(classToClass(createdCustomerIxc));
  }
}
