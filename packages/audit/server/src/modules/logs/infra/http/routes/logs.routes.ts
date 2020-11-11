import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import LogsController from '../controllers/LogsController';

const logsRouter = Router();
const logsController = new LogsController();

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

export default logsRouter;
