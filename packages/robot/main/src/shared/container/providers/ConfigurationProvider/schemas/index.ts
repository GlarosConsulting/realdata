import IBrowserConfigurationSchema from './IBrowserConfigurationSchema';
import ICacheConfigurationSchema from './ICacheConfigurationSchema';
import ILoggerConfigurationSchema from './ILoggerConfigurationSchema';
import IRobotIXCConfigurationSchema from './IRobotIXCConfigurationSchema';

type DefaultSchema = IRobotIXCConfigurationSchema &
  IBrowserConfigurationSchema &
  ICacheConfigurationSchema &
  ILoggerConfigurationSchema;

export default DefaultSchema;
