import { AuthUser, NotAuthenticatedError, NotAuthorizedError } from '@app/core';

export const ensureOwner = (authUser: AuthUser | undefined, ownerId: string) => {
  if (!authUser) {
    throw new NotAuthenticatedError();
  }

  if (authUser.id !== ownerId) {
    throw new NotAuthorizedError({ type: 'owner' });
  }
};
