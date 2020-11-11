import FakeCustomersIXCRepository from '../repositories/fakes/FakeCustomersIXCRepository';
import CreateCustomerIXCService from './CreateCustomerIXCService';

let fakeCustomersIXCRepository: FakeCustomersIXCRepository;
let createCustomerIXC: CreateCustomerIXCService;

describe('CreateCustomerIXC', () => {
  beforeEach(() => {
    fakeCustomersIXCRepository = new FakeCustomersIXCRepository();

    createCustomerIXC = new CreateCustomerIXCService(
      fakeCustomersIXCRepository,
    );
  });

  it('should be able to create customer ixc', async () => {
    const customerIxc = await createCustomerIXC.execute({
      ixc_id: '123',
      ixc_name: '321',
      conta_azul_name: 'Conta Azul',
      status: true,
    });

    expect(customerIxc).toEqual(
      expect.objectContaining({
        ixc_id: expect.any(String),
        ixc_name: expect.any(String),
        conta_azul_name: expect.any(String),
        status: expect.any(Boolean),
      }),
    );
  });
});
