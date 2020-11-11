import { container } from 'tsyringe';

import '@modules/users/providers';

import './providers';

import CustomersIXCRepository from '@modules/customers_ixc/infra/typeorm/repositories/CustomerIXCRepository';
import ICustomersIXCRepository from '@modules/customers_ixc/repositories/ICustomersIXCRepository';
import LogsRepository from '@modules/logs/infra/typeorm/repositories/LogsRepository';
import ILogsRepository from '@modules/logs/repositories/ILogsRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<ILogsRepository>('LogsRepository', LogsRepository);

container.registerSingleton<ICustomersIXCRepository>(
  'CustomersIXCRepository',
  CustomersIXCRepository,
);
