import { GeneralError } from '@feathersjs/errors';
export class BusinessError extends GeneralError {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessError';
  }
}
