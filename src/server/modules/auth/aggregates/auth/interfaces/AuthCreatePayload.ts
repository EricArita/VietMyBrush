export interface AuthCreatePayload {
  idToken: string;
  role: string;
  name: string;
  phoneNumber: string;
  email: string;
  gender: string | any;
  dob: Date | string;
  avatar?: string;
  address?: string;
  country?: string;
  timeZone?: string;
  zipCode?: string;
  appleIdentifierId?: string;
  appleId?: string;
}
