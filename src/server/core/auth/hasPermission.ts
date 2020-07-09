import { AuthUser, NotAuthenticatedError } from '@app/core';
import _ from 'lodash';

export const hasPermission = (user: AuthUser | undefined, permission: string) => {
  if (!permission) {
    return true;
  }

  if (!user) {
    throw new NotAuthenticatedError();
  }

  return user.permissions && user.permissions.indexOf(permission) !== -1;
};
