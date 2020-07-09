import { NotFound } from '@feathersjs/errors';
export class EntityNotFoundError extends NotFound {
  constructor(entityName = 'Entity') {
    super(`${entityName ? entityName : 'Entity'} not found`);
    this.name = 'EntityNotFoundError';
  }
}
