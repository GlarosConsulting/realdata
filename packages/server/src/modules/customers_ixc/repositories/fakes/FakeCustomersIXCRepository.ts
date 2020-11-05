import merge from 'lodash/merge';
import { v4 } from 'uuid';

import ICreateCustomerIXCDTO from '../../dtos/ICreateCustomerIXCDTO';
import CustomerIXC from '../../infra/typeorm/entities/CustomerIXC';
import ICustomersIXCRepository from '../ICustomersIXCRepository';

class FakeCustomersIXCRepository implements ICustomersIXCRepository {
  private customersIxc: CustomerIXC[] = [];

  public async findAll(): Promise<CustomerIXC[]> {
    return this.customersIxc;
  }

  public async findById(id: string): Promise<CustomerIXC | undefined> {
    const findCustomerIxc = this.customersIxc.find(
      customerIxc => customerIxc.id === id,
    );

    return findCustomerIxc;
  }

  public async create(data: ICreateCustomerIXCDTO): Promise<CustomerIXC> {
    const customerIxc = new CustomerIXC();

    merge(customerIxc, { id: v4() }, data);

    this.customersIxc.push(customerIxc);

    return customerIxc;
  }
}

export default FakeCustomersIXCRepository;
