import ICreateCustomerIXCDTO from '../dtos/ICreateCustomerIXCDTO';
import CustomerIXC from '../infra/typeorm/entities/CustomerIXC';

export default interface ICustomersIXCRepository {
  findAll(): Promise<CustomerIXC[]>;
  findById(id: string): Promise<CustomerIXC | undefined>;
  create(data: ICreateCustomerIXCDTO): Promise<CustomerIXC>;
}
