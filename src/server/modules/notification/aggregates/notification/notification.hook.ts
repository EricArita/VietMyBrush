import { Hook, addCreationInfo, addModificationInfo, logApiRequest, authenticate } from '@app/core';
import { notificationRepository } from '@app/notification';

const notificationHook: Hook = {
  before: {
    all: [
      authenticate,
      logApiRequest,
      async (context: any) => {
        context.params.repository = notificationRepository;
      },
    ],
    create: [
      addCreationInfo,
    ],
    patch: [
      addModificationInfo,
    ],
  },
};

export default notificationHook;
