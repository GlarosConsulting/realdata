import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import CustomersIXCController from '../controllers/CustomersIXCController';

const customersIxcRouter = Router();
const customersIxcController = new CustomersIXCController();

customersIxcRouter.get('/', customersIxcController.index);

customersIxcRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      ixc_id: Joi.string().required(),
      ixc_name: Joi.string().required(),
      conta_azul_name: Joi.string().required(),
      status: Joi.boolean().required(),
    },
  }),
  customersIxcController.create,
);

export default customersIxcRouter;
