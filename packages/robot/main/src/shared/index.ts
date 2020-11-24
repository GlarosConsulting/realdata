import 'dotenv/config';
import 'reflect-metadata';

import '@shared/container';

import { container } from 'tsyringe';
import { usage, Argv } from 'yargs';

import IConfigurationProvider from '@shared/container/providers/ConfigurationProvider/models/IConfigurationProvider';
import Launcher from '@shared/puppeteer/launcher';

interface IArgv extends Argv {
  ixc_email: string;
  ixc_password: string;
  ca_email: string;
  ca_password: string;
  cache_key: string;
  headless: boolean;
  verbose: boolean;
}

usage('Usage: $0 <cmd> [options]')
  .command(
    'run',
    'Run RealData robot',
    _yargs => {
      // add positional options
    },
    async (argv: IArgv) => {
      const configurationProvider = container.resolve<IConfigurationProvider>(
        'ConfigurationProvider',
      );

      const {
        ixc_email,
        ixc_password,
        ca_email,
        ca_password,
        ...argvRest
      } = argv;

      await configurationProvider.save({
        ...argvRest,
        ixc: {
          email: ixc_email,
          password: ixc_password,
        },
        conta_azul: {
          email: ca_email,
          password: ca_password,
        },
      });

      const launcher = container.resolve(Launcher);

      launcher
        .launch()
        .catch(err => {
          console.log('Occurred an unexpected error:');
          console.log(err);
        })
        .finally(() => {
          // process.exit();
        });
    },
  )
  .option('ixc_email', {
    type: 'string',
    description: 'IXC account email',
    demandOption: true,
  })
  .option('ixc_password', {
    type: 'string',
    description: 'IXC account email password',
    demandOption: true,
  })
  .option('ca_email', {
    type: 'string',
    description: 'Conta Azul account email',
    demandOption: true,
  })
  .option('ca_password', {
    type: 'string',
    description: 'Conta Azul account email password',
    demandOption: true,
  })
  .option('cache_key', {
    type: 'string',
    description: 'Set the custom cache key',
    default: process.env.REDIS_DEFAULT_CACHE_KEY,
  })
  .option('headless', {
    type: 'boolean',
    description: 'Run with headless browser',
    default: false,
  })
  .option('verbose', {
    type: 'boolean',
    description: 'Run with verbose logging',
    default: false,
  })
  .help()
  .strict().argv;
