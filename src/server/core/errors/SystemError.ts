import { GeneralError } from '@feathersjs/errors';
export class SystemError extends GeneralError {
  constructor(message: string) {
    super(message);
    this.name = 'SystemError';
  }
}
