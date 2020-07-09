import { AuthUser, ERROR_NAMES, ensureRole } from '@app/core';
import { expect } from 'chai';
describe('core/auth/ensureRole', () => {
  let authUser: AuthUser;

  beforeEach(() => {
    authUser = {
      id: '123',
      roles: ['roleTest'],
      permissions: ['AUTH.USER.EDIT'],
    };
  });

  it('should throw error if unauthenticated', async () => {
    let throwError = false;
    try {
      await ensureRole(undefined, 'roleTest');
    } catch (error) {
      expect(error.name).to.equal(ERROR_NAMES.NOT_AUTHENTICATED_ERROR);
      throwError = true;
    }
    expect(throwError).to.equal(true);
  });

  it('should throw error if not having the permission', async () => {
    let throwError = false;
    try {
      await ensureRole(authUser, 'roleTest1');
    } catch (error) {
      expect(error.name).to.equal(ERROR_NAMES.NOT_AUTHORIZED_ERROR);
      throwError = true;
    }
    expect(throwError).to.equal(true);
  });

  it('should run successfully if having the permission', async () => {
    await ensureRole(authUser, 'roleTest');
  });
});
