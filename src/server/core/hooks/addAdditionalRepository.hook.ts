import { Repository, Aggregate } from '@app/core';
import { HookContext } from '@feathersjs/feathers';

export const addAdditionalRepository = <T extends Aggregate>(repository: Repository<T>, repositoryName: string) => {
  return async (context: HookContext) => {
    context.params[repositoryName] = repository;
  };
};
