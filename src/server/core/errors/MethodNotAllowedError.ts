import { MethodNotAllowed } from '@feathersjs/errors';

export class MethodNotAllowedError extends MethodNotAllowed {
  constructor() {
    super(`Method not allowed`);
    this.name = 'MethodNotAllowedError';
  }
}
