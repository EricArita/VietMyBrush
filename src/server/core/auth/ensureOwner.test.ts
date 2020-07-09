import { AuthUser, ERROR_NAMES, ensureOwner } from '@app/core';
import { expect } from 'chai';
describe('core/auth/ensureOwner', () => {
  let authUser: AuthUser;

  beforeEach(() => {
    authUser = {
      id: '123',
      roles: [],
      permissions: [],
    };
  });

  it('should throw error if unauthenticated', async () => {
    let throwError = false;
    try {
      await ensureOwner(undefined, '');
    } catch (error) {
      expect(error.name).to.equal(ERROR_NAMES.NOT_AUTHENTICATED_ERROR);
      throwError = true;
    }
    expect(throwError).to.equal(true);
  });

  it('should throw error if not the owner', async () => {
    let throwError = false;
    try {
      await ensureOwner(authUser, '456');
    } catch (error) {
      expect(error.name).to.equal(ERROR_NAMES.NOT_AUTHORIZED_ERROR);
      throwError = true;
    }
    expect(throwError).to.equal(true);
  });

  it('should run successfully if being the owner', async () => {
    await ensureOwner(authUser, '123');
  });
});
