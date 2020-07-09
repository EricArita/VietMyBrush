import { replace } from 'lodash';
import admin from 'firebase-admin';
import { AuthUser } from './AuthUser';
import { HookContext } from '@feathersjs/feathers';
import { NotAuthenticatedError } from '../errors/NotAuthenticatedError';

export const authenticate = async (context: HookContext) => {
  try {
    const idToken = replace(context.params.authorization, 'Bearer ', '');
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);

    const authUser: AuthUser = {
      id: decodedIdToken.uid,
      roles: [],
      permissions: [],
      fullName: decodedIdToken.name,
    };
    context.params.authUser = authUser;
  } catch (err) {
    throw new NotAuthenticatedError();
  }
};
