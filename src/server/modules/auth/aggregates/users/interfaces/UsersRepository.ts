import { Repository, FindResult } from '@app/core';
import { User, FindUsersQuery } from '@app/auth';

export interface UsersRepository extends Repository<User> {
  findByRole: (role: string) => Promise<User[]>;
  find: (query: FindUsersQuery) => Promise<FindResult<User>>;
  findAll: () => any;
  getPermissions: (id: string) => Promise<string[]>;
  removeDeviceToken: (id: string, deviceToken: string) => Promise<any>;
}
