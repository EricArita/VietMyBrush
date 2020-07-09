import { AuthUser, NotAuthenticatedError } from '@app/core';

export const isOwner = (authUser: AuthUser | undefined, ownerId: string) => {
  if (!authUser) {
    throw new NotAuthenticatedError();
  }
  return authUser.id === ownerId;
};
