import { ServiceAccount } from 'firebase-admin';

export interface FirebaseConfiguration {
  serviceAccount: ServiceAccount;
  databaseURL: string;
}
