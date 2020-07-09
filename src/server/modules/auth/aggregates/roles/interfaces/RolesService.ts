import { Service, RequestParams } from '@app/core';
import { Role, FindRolesQuery, RolesRepository } from '@app/auth';
import { UsersRepository } from '../../users/interfaces/UsersRepository';
import { Application } from '@feathersjs/express';

export interface RolesService extends Service<Role, FindRolesQuery, RolesRepository> {
  setup?: (app: Application<any>, path: string) => void;
  updateDetail: (id: string, data: Partial<Role>, params: RequestParams<RolesRepository> & {userRepository: UsersRepository}) => Promise<{}>;
  activate: (id: string, data: Partial<Role>, params: RequestParams<RolesRepository>) => Promise<{}>;
  deactivate: (id: string, data: Partial<Role>, params: RequestParams<RolesRepository>) => Promise<{}>;
}
