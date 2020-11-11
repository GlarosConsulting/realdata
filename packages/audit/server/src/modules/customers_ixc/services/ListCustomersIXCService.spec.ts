import FakeCustomersIXCRepository from '../repositories/fakes/FakeCustomersIXCRepository';
import ListCustomersIXCService from './ListCustomersIXCService';

let fakeCustomersIxcRepository: FakeCustomersIXCRepository;
let listCustomersIxc: ListCustomersIXCService;

describe('ListCustomersIXC', () => {
  beforeEach(() => {
    fakeCustomersIxcRepository = new FakeCustomersIXCRepository();

    listCustomersIxc = new ListCustomersIXCService(fakeCustomersIxcRepository);
  });

  it('should be able to list customers ixc', async () => {
    await fakeCustomersIxcRepository.create({
      ixc_id: '123',
      ixc_name: '321',
      conta_azul_name: 'Conta Azul',
      status: true,
    });

    const customerIxc = await listCustomersIxc.execute();

    expect(customerIxc).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ixc_id: expect.any(String),
          ixc_name: expect.any(String),
          conta_azul_name: expect.any(String),
          status: expect.any(Boolean),
        }),
      ]),
    );
  });
});
