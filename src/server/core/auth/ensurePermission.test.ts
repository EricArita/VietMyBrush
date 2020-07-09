import { AuthUser, ERROR_NAMES, ensurePermission } from '@app/core';
import { expect } from 'chai';
describe('core/auth/ensurePermission', () => {
  let authUser: AuthUser;

  beforeEach(() => {
    authUser = {
      id: '123',
      roles: [],
      permissions: ['AUTH.USER.EDIT'],
    };
  });

  it('should throw error if unauthenticated', async () => {
    let throwError = false;
    try {
      await ensurePermission(undefined, 'AUTH.USER.EDIT');
    } catch (error) {
      expect(error.name).to.equal(ERROR_NAMES.NOT_AUTHENTICATED_ERROR);
      throwError = true;
    }
    expect(throwError).to.equal(true);
  });

  it('should throw error if not having the permission', async () => {
    let throwError = false;
    try {
      await ensurePermission(authUser, 'AUTH.USER.VIEW');
    } catch (error) {
      expect(error.name).to.equal(ERROR_NAMES.NOT_AUTHORIZED_ERROR);
      throwError = true;
    }
    expect(throwError).to.equal(true);
  });

  it('should run successfully if having the permission', async () => {
    await ensurePermission(authUser, 'AUTH.USER.EDIT');
  });
});
