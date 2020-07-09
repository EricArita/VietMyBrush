import { config } from '@client/config';

export const hasSignInOption = (signInOption: 'email'|'phone'|'google'|'facebook') => {
  return config.signInOptions.indexOf(signInOption) > -1;
};
