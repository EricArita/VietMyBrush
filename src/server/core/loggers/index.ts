import bunyan from 'bunyan';
import { config } from '@app/config';

const logger: bunyan = bunyan.createLogger({
  name: config.appName,
  streams: config.logger.streams
    .map((streamConfig: any) => streamConfig.stream === 'process.stdout'
      ? ({ ...streamConfig, stream: process.stdout })
      : streamConfig),
});

export {
  logger,
};
