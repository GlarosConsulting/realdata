import { getRepository, Repository } from 'typeorm';

import ICreateCustomerIXCDTO from '@modules/customers_ixc/dtos/ICreateCustomerIXCDTO';
import ICustomersIXCRepository from '@modules/customers_ixc/repositories/ICustomersIXCRepository';

import CustomerIXC from '../entities/CustomerIXC';

class CustomersIXCRepository implements ICustomersIXCRepository {
  private ormRepository: Repository<CustomerIXC>;

  constructor() {
    this.ormRepository = getRepository(CustomerIXC);
  }

  public async findAll(): Promise<CustomerIXC[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<CustomerIXC | undefined> {
    const customerIxc = await this.ormRepository.findOne(id);

    return customerIxc;
  }

  public async create(data: ICreateCustomerIXCDTO): Promise<CustomerIXC> {
    const customerIxc = this.ormRepository.create(data);

    await this.ormRepository.save(customerIxc);

    return customerIxc;
  }
}

export default CustomersIXCRepository;
