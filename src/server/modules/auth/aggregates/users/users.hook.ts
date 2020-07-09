import { Hook, addCreationInfo, addModificationInfo, logApiRequest, authenticate } from '@app/core';
import { userRepository, roleRepository } from '@app/auth';
import { HookContext } from '@feathersjs/feathers';

const usersHook: Hook = {
  before: {
    all: [
      logApiRequest,
      async (context: any) => {
        context.params.repository = userRepository;
      },
    ],
    create: [
      authenticate,
      addCreationInfo,
      async ({ params }: HookContext) => {
        params.roleRepository = roleRepository;
      },
    ],
    patch: [
      authenticate,
      addModificationInfo,
      async (context: any) => {
        context.params.roleRepository = roleRepository;
      },
    ],
  },
};

export default usersHook;
