import { authenticate, AuthUser, ERROR_NAMES } from '@app/core';
import { expect } from 'chai';
import admin from 'firebase-admin';
import { createSandbox, SinonSandbox } from 'sinon';
describe('core/auth/authenticate', () => {
  let context: any;
  let authUser: AuthUser;
  let sinon: SinonSandbox;

  beforeEach(() => {
    sinon = createSandbox();
    context = {
      params: {
        authorization: 'Bearer TestToken',
      },
    };
    authUser = {
      id: 'id',
      roles: [],
      permissions: [],
    };
  });
  afterEach(() => {
    sinon.restore();
  });

  it('should return the correct auth user', async () => {
    sinon.stub(admin, 'auth').get(function getterFn() {
      return () => {
        return {
          verifyIdToken: async (_idToken: string) => {
            return {
              uid: authUser.id,
              ...authUser,
            };
          },
        };
      };
    });
    await authenticate(context);
    expect(authUser).to.eql(context.params.authUser);
  });

  it('should return the correct auth user with no permissions', async () => {
    sinon.stub(admin, 'auth').get(function getterFn() {
      return () => {
        return {
          verifyIdToken: async (_idToken: string) => {
            return {
              uid: authUser.id,
              ...authUser,
              permissions: undefined,
            };
          },
        };
      };
    });
    await authenticate(context);
    expect(authUser).to.eql(context.params.authUser);
  });

  it('should throw NotAuthenticatedError if the token is incorrect', async () => {
    let throwError = false;
    try {
      sinon.stub(admin, 'auth').get(function getterFn() {
        return () => {
          return {
            verifyIdToken: async (_idToken: string) => {
              throw new Error();
            },
          };
        };
      });
      await authenticate(context);
    } catch (error) {
      expect(error.name).to.equal(ERROR_NAMES.NOT_AUTHENTICATED_ERROR);
      throwError = true;
    }
    expect(throwError).to.equal(true);
  });
});
