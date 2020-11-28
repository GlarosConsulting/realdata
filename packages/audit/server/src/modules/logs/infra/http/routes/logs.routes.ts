import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import LogsController from '../controllers/LogsController';
import UpdateLogDischargePerformedController from '../controllers/UpdateLogDischargePerformedController';

const logsRouter = Router();
const logsController = new LogsController();
const updateLogDischargePerformedController = new UpdateLogDischargePerformedController();

logsRouter.get('/', logsController.index);

logsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      date: Joi.date().required(),
      ixc_id: Joi.string().required(),
      projection_id: Joi.string().required(),
      conta_azul_existing: Joi.boolean().required(),
      discharge_performed: Joi.boolean().required(),
    },
  }),
  logsController.create,
);

logsRouter.patch(
  '/:log_id/discharge-performed',
  celebrate({
    [Segments.PARAMS]: {
      log_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      discharge_performed: Joi.boolean().required(),
    },
  }),
  updateLogDischargePerformedController.update,
);

export default logsRouter;
