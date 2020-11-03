import { injectable, inject } from 'tsyringe';

import CustomerIXC from '../infra/typeorm/entities/CustomerIXC';
import ICustomersIXCRepository from '../repositories/ICustomersIXCRepository';

interface IRequest {
  ixc_id: string;
  ixc_name: string;
  conta_azul_name: string;
  status: boolean;
}

@injectable()
export default class CreateCustomerIXCService {
  constructor(
    @inject('CustomersIXCRepository')
    private customersIxcRepository: ICustomersIXCRepository,
  ) {}

  public async execute({
    ixc_id,
    ixc_name,
    conta_azul_name,
    status,
  }: IRequest): Promise<CustomerIXC> {
    const createdCustomerIxc = await this.customersIxcRepository.create({
      ixc_id,
      ixc_name,
      conta_azul_name,
      status,
    });

    return createdCustomerIxc;
  }
}
