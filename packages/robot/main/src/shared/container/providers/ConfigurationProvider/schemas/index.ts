import IBrowserConfigurationSchema from './IBrowserConfigurationSchema';
import ICacheConfigurationSchema from './ICacheConfigurationSchema';
import ILoggerConfigurationSchema from './ILoggerConfigurationSchema';
import IRobotContaAzulConfigurationSchema from './IRobotContaAzulConfigurationSchema';
import IRobotIXCConfigurationSchema from './IRobotIXCConfigurationSchema';

type DefaultSchema = IRobotIXCConfigurationSchema &
  IRobotContaAzulConfigurationSchema &
  IBrowserConfigurationSchema &
  ICacheConfigurationSchema &
  ILoggerConfigurationSchema;

export default DefaultSchema;
