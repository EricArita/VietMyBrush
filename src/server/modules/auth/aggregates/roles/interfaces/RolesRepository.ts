import { Repository, FindResult } from '@app/core';
import { Role, FindRolesQuery } from '@app/auth';

export interface RolesRepository extends Repository<Role> {
  findAll: () => Promise<Role[]>;
  find: (query: FindRolesQuery) => Promise<FindResult<Role>>;
  findByIds: (ids: string[]) => Promise<Role[]>;
  findDefaultRoles: () => Promise<Role[]>;
  findRoleByName: (name: string) => Promise<Role[]>;
}
