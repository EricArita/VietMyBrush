import { BadRequest } from '@feathersjs/errors';
export class RouteInputError extends BadRequest {
  constructor(message: string) {
    super(message);
    this.name = 'RouteInputError';
  }
}
