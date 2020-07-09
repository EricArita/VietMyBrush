import { Aggregate, IsAuditable, TimestampInDays, Gender } from '@app/core';

interface FacebookLogin {
  uid: string;
  email: string;
  provider: 'facebook';
}

interface GoogleLogin {
  uid: string;
  email: string;
  provider: 'google';
}

interface PhoneLogin {
  phoneNo: string;
  provider: 'phone';
}

interface EmailLogin {
  email: string;
  provider: 'email';
}

export interface User extends Aggregate, IsAuditable {
  email: string;
  familyName?: string;
  givenName?: string;
  fullName?: string;
  phoneNumber?: string;
  address: string;
  description: string;
  avatar?: string;
  dob?: TimestampInDays | number;
  gender?: Gender;
  loginDetail: FacebookLogin | GoogleLogin | PhoneLogin | EmailLogin;
  loginMethods: any;
  roles: string[];
  completeSignUp: boolean;
  isActive: boolean;
  deviceToken: string;
  resetPasscode?: {
    code?: string;
    createdAt?: number | Date | TimestampInDays;
  };
  unset: any;
  isVerified: boolean;
  appleIdentifierId?: string;
}
