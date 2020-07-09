import { Hook, authenticate, addCreationInfo, addModificationInfo, logApiRequest } from '@app/core';
import { roleRepository, userRepository } from '@app/auth';

const rolesHook: Hook = {
  before: {
    all: [
      authenticate,
      logApiRequest,
      async (context: any) => {
        context.params.repository = roleRepository;
      },
    ],
    create: [
      addCreationInfo,
    ],
    patch: [
      addModificationInfo,
      async (context: any) => {
        context.params.userRepository = userRepository;
      },
    ],
  },
};

export default rolesHook;
