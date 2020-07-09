import { AuthUser, NotAuthenticatedError } from '@app/core';
import _ from 'lodash';

export const hasRole = (authUser: AuthUser | undefined, roleId: string) => {
  if (!roleId) {
    return true;
  } else {
    if (!authUser) {
      throw new NotAuthenticatedError();
    }
    return authUser.roles && authUser.roles.indexOf(roleId) !== -1;
  }
};
