import { NotImplemented } from '@feathersjs/errors';

export class NotImplementedError extends NotImplemented {
  constructor() {
    super(`Not implemented`);
    this.name = 'NotImplementedError';
  }
}
