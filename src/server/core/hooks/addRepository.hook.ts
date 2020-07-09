import { Repository, Aggregate } from '@app/core';
import { HookContext } from '@feathersjs/feathers';

export const addRepository = <T extends Aggregate>(repository: Repository<T>) => {
  return async (context: HookContext) => {
    context.params.repository = repository;
  };
};
