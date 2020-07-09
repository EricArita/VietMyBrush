
import { expect } from 'chai';
import { TestAuthParams, AuthUser, ERROR_NAMES } from '@app/core';
import { Repository } from '../databases/Repository';

export const testAuthPermission = (params: TestAuthParams) => {
  const authUser: AuthUser = {
    id: '36d538a2-6073-4d0a-957a-c1af270783ea',
    permissions: [],
    roles: [],
  };
  const repositoryCallCount = {
    findById: 0,
    findOne: 0,
    find: 0,
    count: 0,
    create: 0,
    update: 0,
    del: 0,
  };
  const repository: Repository<any> = {
    findById: async (_id) => {
      repositoryCallCount.findById++;
      return {};
    },
    findOne: async (_query) => {
      repositoryCallCount.findOne++;
      return {};
    },
    find: async (_query) => {
      repositoryCallCount.find++;
      return {
        data: [],
      };
    },
    count: async (_query) => {
      repositoryCallCount.count++;
      return 0;
    },
    create: async (_entity) => {
      repositoryCallCount.create++;
      return '';
    },
    update: async (_entity) => {
      repositoryCallCount.update++;
      // nothing
    },
    del: async (_entity) => {
      repositoryCallCount.del++;
      // nothing
    },
    ensureIndexes: async () => {
      // nothing
    },
  };

  it('should throw NotAuthenticatedError if auth user is blank', async () => {
    let throwError = false;
    try {
      switch (params.operationType) {
        case 'find':
          await params.find({ query: params.query, repository, translate: params.translate });
          break;
        case 'create':
          await params.create({}, { ...params, repository });
          break;
        case 'patch':
          await params.patch('', { operation: params.operation, payload: {} }, { ...params, repository });
          break;
        default:
          break;
      }
    } catch (error) {
      expect(error.name).to.equal(ERROR_NAMES.NOT_AUTHENTICATED_ERROR);
      throwError = true;
    }
    expect(throwError).to.equal(true);
  });

  it(`should throw NotAuthorizedError if user does not have permission ${params.permission}`, async () => {
    let throwError = false;
    try {
      switch (params.operationType) {
        case 'find':
          await params.find({ query: params.query, authUser, repository, translate: params.translate });
          break;
        case 'create':
          await params.create({}, { ...params, authUser, repository });
          break;
        case 'patch':
          await params.patch('', { operation: params.operation, payload: {} }, { ...params, authUser, repository });
          break;
        default:
          break;
      }
    } catch (error) {
      expect(error.name).to.equal(ERROR_NAMES.NOT_AUTHORIZED_ERROR);
      expect(error.message).to.contain(params.permission);
      throwError = true;
    }
    expect(throwError).to.equal(true);
  });
};
