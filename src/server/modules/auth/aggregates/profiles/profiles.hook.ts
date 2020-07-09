import { Hook, authenticate, addCreationInfo, addModificationInfo, logApiRequest } from '@app/core';
import { userRepository } from '@app/auth';

const profilesHook: Hook = {
  before: {
    all: [
      authenticate,
      logApiRequest,
      async (context: any) => {
        context.params.repository = userRepository;
      },
    ],
    find: [
      authenticate,
    ],
    get: [
      authenticate,
    ],
    create: [
      addCreationInfo,
    ],
    patch: [
      addModificationInfo,
    ],
  },
};

export default profilesHook;
