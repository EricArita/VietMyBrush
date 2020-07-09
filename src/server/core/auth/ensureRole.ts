import { AuthUser, NotAuthenticatedError, NotAuthorizedError } from '@app/core';
import _ from 'lodash';

export const ensureRole = (authUser: AuthUser | undefined, roleId: string) => {
  if (roleId) {
    if (!authUser) {
      throw new NotAuthenticatedError();
    } else if (!authUser.roles || authUser.roles.indexOf(roleId) === -1) {
      throw new NotAuthorizedError({ type: 'role', role: roleId });
    }
  }
};
