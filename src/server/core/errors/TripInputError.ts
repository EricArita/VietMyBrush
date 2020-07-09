import { BadRequest } from '@feathersjs/errors';
export class TripInputError extends BadRequest {
  constructor(message: string) {
    super(message);
    this.name = 'TripInputError';
  }
}
