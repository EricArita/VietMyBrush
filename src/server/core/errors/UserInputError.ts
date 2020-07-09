import { BadRequest } from '@feathersjs/errors';
export class UserInputError extends BadRequest {
  constructor(message: string) {
    super(message);
    this.name = 'UserInputError';
  }
}
