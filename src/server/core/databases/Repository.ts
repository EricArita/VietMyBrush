import { Aggregate, Query, FindQuery, FindResult } from '@app/core';

export interface Repository<T extends Aggregate> {
  findById: (id: string) => Promise<T>;
  findOne: (query: Query) => Promise<T>;
  find: (query: FindQuery) => Promise<FindResult<T>>;
  count: (query: Query) => Promise<number>;
  create: (entity: T) => Promise<string>;
  update: (entity: Partial<T>) => Promise<void>;
  del: (id: string) => Promise<void>;
  ensureIndexes: () => Promise<void>;
  delByCriteria?: (criteria: any) => Promise<any>;
}
