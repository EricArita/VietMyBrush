import { BusinessError, EntityNotFoundError, MethodNotAllowedError, NotAuthenticatedError, NotAuthorizedError, NotImplementedError, SystemError, UserInputError } from '@app/core';
import { expect } from 'chai';
describe('core/auth/errors', () => {
  it('BusinessError should return correct error names', async () => {
    const error = new BusinessError('error');
    expect(error.name).to.equal('BusinessError');
  });

  it('EntityNotFoundError should return correct error names', async () => {
    const error = new EntityNotFoundError('entity');
    expect(error.name).to.equal('EntityNotFoundError');
  });

  it('MethodNotAllowedError should return correct error names', async () => {
    const error = new MethodNotAllowedError();
    expect(error.name).to.equal('MethodNotAllowedError');
  });

  it('NotAuthenticatedError should return correct error names', async () => {
    const error = new NotAuthenticatedError();
    expect(error.name).to.equal('NotAuthenticatedError');
  });

  it('NotAuthorizedError should return correct error names for validating a permission', async () => {
    const error = new NotAuthorizedError({ type: 'permission', permission: 'PERMISSION.TEST' });
    expect(error.name).to.equal('NotAuthorizedError');
  });

  it('NotAuthorizedError should return correct error names for validating a role', async () => {
    const error = new NotAuthorizedError({ type: 'role', role: 'ROLE.TEST' });
    expect(error.name).to.equal('NotAuthorizedError');
  });

  it('NotAuthorizedError should return correct error names for validating a owner', async () => {
    const error = new NotAuthorizedError({ type: 'owner' });
    expect(error.name).to.equal('NotAuthorizedError');
  });

  it('NotImplementedError should return correct error names', async () => {
    const error = new NotImplementedError();
    expect(error.name).to.equal('NotImplementedError');
  });

  it('SystemError should return correct error names', async () => {
    const error = new SystemError('error message');
    expect(error.name).to.equal('SystemError');
  });

  it('UserInputError should return correct error names', async () => {
    const error = new UserInputError('error message');
    expect(error.name).to.equal('UserInputError');
  });
});
