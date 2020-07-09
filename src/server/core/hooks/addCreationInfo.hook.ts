import _ from 'lodash';
import { getCurrentTimestampInMilliseconds } from '@app/core';
import { HookContext } from '@feathersjs/feathers';

export const addCreationInfo = async (context: HookContext) => {
  context.params.creationInfo = {
    createdBy: context.params.authUser ? context.params.authUser.id : '',
    createdAt: getCurrentTimestampInMilliseconds(),
  };
};
