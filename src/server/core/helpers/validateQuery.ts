import { FindQuery } from '@app/core';
import { UserInputError } from '../errors/UserInputError';

export const validateQuery = (query: FindQuery | undefined) => {
  if (!query) {
    throw new UserInputError('Query is undefined');
  }
  if (!query.first || isNaN(query.first) || query.first < 0 || query.first > 50) {
    throw new UserInputError('Query.first is invalid');
  }
};
