import { NotAuthenticated } from '@feathersjs/errors';
export class NotAuthenticatedError extends NotAuthenticated {
  constructor() {
    super(`Not authenticated`);
    this.name = 'NotAuthenticatedError';
  }
}
