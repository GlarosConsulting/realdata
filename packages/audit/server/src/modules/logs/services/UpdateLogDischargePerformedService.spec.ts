import AppError from '@shared/errors/AppError';

import FakeLogsRepository from '../repositories/fakes/FakeLogsRepository';
import CreateLogService from './CreateLogService';
import UpdateLogDischargePerformedService from './UpdateLogDischargePerformedService';

let fakeLogsRepository: FakeLogsRepository;
let createLog: CreateLogService;
let updateLogDischargePerformed: UpdateLogDischargePerformedService;

describe('UpdateLogDischargePerformed', () => {
  beforeEach(() => {
    fakeLogsRepository = new FakeLogsRepository();

    createLog = new CreateLogService(fakeLogsRepository);
    updateLogDischargePerformed = new UpdateLogDischargePerformedService(
      fakeLogsRepository,
    );
  });

  it('should be able to update log', async () => {
    const createdLog = await createLog.execute({
      date: new Date(),
      ixc_id: '123',
      projection_id: '321',
      conta_azul_existing: true,
      discharge_performed: true,
    });

    const log = await updateLogDischargePerformed.execute({
      log_id: createdLog.id,
      discharge_performed: false,
    });

    expect(log).toEqual(
      expect.objectContaining({
        date: expect.any(Date),
        ixc_id: expect.any(String),
        projection_id: expect.any(String),
        conta_azul_existing: expect.any(Boolean),
        discharge_performed: false,
      }),
    );
  });

  it('should not be able to update log with non-existing log', async () => {
    await expect(
      updateLogDischargePerformed.execute({
        log_id: 'non-existing-log',
        discharge_performed: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
