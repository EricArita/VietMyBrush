import { UserInputError } from '../errors/UserInputError';

export const validateOperation = (operation: string, allowedOperations: string[]) => {
  if (allowedOperations.indexOf(operation) === -1) {
    throw new UserInputError('Invalid operation');
  }
};
