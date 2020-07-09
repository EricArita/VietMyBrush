import { FindQuery } from '@app/core';

export interface FindRolesQuery extends FindQuery {
  search?: string;
  permissions?: string[];
}
