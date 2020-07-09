import { AuthUser } from '@client/store';

export const checkPermission = (authUser: AuthUser, requiredPermission: string) => {
  if (!requiredPermission) {
    return true;
  }

  return requiredPermission && authUser && authUser.permissions && authUser.permissions.indexOf(requiredPermission) > -1;
};
