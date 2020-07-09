import _ from 'lodash';
import { getCurrentTimestampInMilliseconds } from '@app/core';
import { HookContext } from '@feathersjs/feathers';

export const addModificationInfo = async (context: HookContext) => {
  context.params.modificationInfo = {
    lastModifiedBy: context.params.authUser ? context.params.authUser.id : '',
    lastModifiedAt: getCurrentTimestampInMilliseconds(),
  };
};
