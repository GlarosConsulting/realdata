import { injectable, inject } from 'tsyringe';

import CustomerIXC from '../infra/typeorm/entities/CustomerIXC';
import ICustomersIXCRepository from '../repositories/ICustomersIXCRepository';

@injectable()
export default class ListCustomersIXCService {
  constructor(
    @inject('CustomersIXCRepository')
    private customersIxcRepository: ICustomersIXCRepository,
  ) {}

  public async execute(): Promise<CustomerIXC[]> {
    const customersIxc = await this.customersIxcRepository.findAll();

    return customersIxc;
  }
}
