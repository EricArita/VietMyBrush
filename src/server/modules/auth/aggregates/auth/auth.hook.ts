import { Hook, logApiRequest } from '@app/core';
import { userRepository, roleRepository } from '@app/auth';
import { HookContext } from '@feathersjs/feathers';

const authHook: Hook = {
  before: {
    all: [
      logApiRequest,
      async (context: any) => {
        context.params.repository = userRepository;
      },
    ],
    create: [
      async ({ params }: HookContext) => {
        params.roleRepository = roleRepository;
      },
    ],
  },
};

export default authHook;
