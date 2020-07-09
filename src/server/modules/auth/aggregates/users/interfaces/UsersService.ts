import { RequestParams, PatchPayload, FindResult } from '@app/core';
import { User, FindUsersQuery, UsersRepository, RolesRepository } from '@app/auth';
import { Application } from '@feathersjs/express';

export interface UsersService {
  setup?: (app: Application<any>, path: string) => void;
  find?: (params: RequestParams<UsersRepository> & { query: FindUsersQuery }) => Promise<FindResult<User>>;
  get?: (id: string, params: RequestParams<UsersRepository>) => Promise<User>;
  create: (data: User & { password: string }, params: RequestParams<UsersRepository> & { roleRepository: RolesRepository }) => Promise<{ id: string }>;
  patch?: (id: string, data: PatchPayload<User>, params: RequestParams<UsersRepository>) => Promise<{}>;
  updateDetail: (id: string, data: Partial<User>, params: RequestParams<UsersRepository> & {roleRepository: RolesRepository}) => Promise<{}>;
  activate: (id: string, data: Partial<User>, params: RequestParams<UsersRepository>) => Promise<{}>;
  deactivate: (id: string, data: Partial<User>, params: RequestParams<UsersRepository>) => Promise<{}>;
  getPermissions: (id: string) => Promise<string[]>;
  getUser: (id: string) => Promise<any>;
}
