import FakeLogsRepository from '../repositories/fakes/FakeLogsRepository';
import ListLogsService from './ListLogsService';

let fakeLogsRepository: FakeLogsRepository;
let listLogs: ListLogsService;

describe('ListLogs', () => {
  beforeEach(() => {
    fakeLogsRepository = new FakeLogsRepository();

    listLogs = new ListLogsService(fakeLogsRepository);
  });

  it('should be able to list logs', async () => {
    await fakeLogsRepository.create({
      date: new Date(),
      ixc_id: '123',
      projection_id: '321',
      conta_azul_existing: true,
      discharge_performed: true,
    });

    const logs = await listLogs.execute();

    expect(logs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: expect.any(Date),
          ixc_id: expect.any(String),
          projection_id: expect.any(String),
          conta_azul_existing: expect.any(Boolean),
          discharge_performed: expect.any(Boolean),
        }),
      ]),
    );
  });
});
