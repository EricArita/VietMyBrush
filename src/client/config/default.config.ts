import { overrideConfig } from './override.config';

export const config = {
  appName: '',
  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
  },
  url: {
    main: '',
    api: '',
  },
  signInOptions: [
    'email',
    // 'phone',
    // 'facebook',
    // 'google',
  ],
  i18n: {
    VN: 'vn',
    EN: 'en',
    defaultLang: 'vn',
  },
  dateFormat: 'DD/MM/YYYY',
  imageSize: 2,

  ...overrideConfig,
};
