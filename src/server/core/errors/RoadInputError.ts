import { BadRequest } from '@feathersjs/errors';
export class RoadInputError extends BadRequest {
  constructor(message: string) {
    super(message);
    this.name = 'RoadInputError';
  }
}
