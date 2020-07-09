import { HookContext } from '@feathersjs/feathers';
import { logger, isDev } from '@app/core';
import moment from 'moment';

export const logApiRequest = async (context: HookContext) => {
  if (isDev) {
    logger.info({
      timestamp: moment().format('DD/MM/YYYY HH:mm'),
      user: context.params.authUser ? context.params.authUser.id : '',
      service: context.path,
      method: context.method,
      id: context.id,
      data: context.data,
      query: context.params.query,
    });
  }
};
