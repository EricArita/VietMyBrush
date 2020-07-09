import { BadRequest } from '@feathersjs/errors';
export class NotificationInputError extends BadRequest {
  constructor(message: string) {
    super(message);
    this.name = 'NotificationInputError';
  }
}
