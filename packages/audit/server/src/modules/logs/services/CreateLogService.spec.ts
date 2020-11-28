import FakeLogsRepository from '../repositories/fakes/FakeLogsRepository';
import CreateLogService from './CreateLogService';

let fakeLogsRepository: FakeLogsRepository;
let createLog: CreateLogService;

describe('CreateLog', () => {
  beforeEach(() => {
    fakeLogsRepository = new FakeLogsRepository();

    createLog = new CreateLogService(fakeLogsRepository);
  });

  it('should be able to create log', async () => {
    const log = await createLog.execute({
      date: new Date(),
      ixc_id: '123',
      projection_id: '321',
      conta_azul_existing: true,
      discharge_performed: true,
    });

    expect(log).toEqual(
      expect.objectContaining({
        date: expect.any(Date),
        ixc_id: expect.any(String),
        projection_id: expect.any(String),
        conta_azul_existing: expect.any(Boolean),
        discharge_performed: expect.any(Boolean),
      }),
    );
  });
});
