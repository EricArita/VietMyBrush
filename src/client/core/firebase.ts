import firebase from 'firebase/app';
import { config } from '@client/config';
import 'firebase/auth';

export const initializeFirebaseApp = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebase);
  }
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    // tslint:disable-next-line:no-console
    .catch((error) => console.log(error));
};
