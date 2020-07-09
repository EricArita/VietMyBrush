import { Hook, logger } from '@app/core';
import { HookContext } from '@feathersjs/feathers';

const applicationHook: Hook = {
  error: {
    all: [
      async (context: HookContext) => {
        logger.error(`Error in service '${context.path}' method '${context.method}'`, context.error.stack);
      },
    ],
  },
};

export default applicationHook;
