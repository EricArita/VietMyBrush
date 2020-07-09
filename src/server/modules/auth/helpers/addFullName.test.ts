import { addFullName } from '@app/auth';
import { expect } from 'chai';
describe('auth/helpers/addFullName', () => {

  it('should return correct the full name with given name first', async () => {
    const name = addFullName({ familyName: 'Tran', givenName: 'Thinh', type: 'givenNameFirst' });
    expect(name).to.equal('Thinh Tran');
  });

  it('should return correct the full name with family name first', async () => {
    const name = addFullName({ familyName: 'Tran', givenName: 'Thinh', middleName: 'Quang', type: 'familyNameFirst' });
    expect(name).to.equal('Tran Quang Thinh');
  });
});
