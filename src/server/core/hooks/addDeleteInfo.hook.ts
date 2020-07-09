import * as _ from 'lodash';
import { HookContext } from '@feathersjs/feathers';
import { getCurrentTimestampInMilliseconds } from '@app/core';

export const addDeleteInfo = async (context: HookContext) => {
  context.params.deleteInfo = {
    deletedBy: context.params.authUser ? context.params.authUser.id : '',
    deletedAt: getCurrentTimestampInMilliseconds(),
  };
};
