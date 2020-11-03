import { Router } from 'express';

import customersIxcRouter from '@modules/customers_ixc/infra/http/routes/customers_ixc.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';

const routes = Router();

routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/users', usersRouter);
routes.use('/profile', profileRouter);
routes.use('/customers-ixc', customersIxcRouter);

routes.get('/', (_request, response) =>
  response.json({
    name: 'RealData API',
    version: '1.0.0',
  }),
);

export default routes;
