import { overrideConfig } from './override.config';

export const config = {
  // appName: '',
  // web: {
  //   cors: {
  //     whitelistUrls: [],
  //   },
  //   api: {
  //     prefix: '',
  //     docsUrl: '',
  //     docsJson: '',
  //   },
  //   log: {
  //     apiRequest: true,
  //   },
  // },
  // database: {
  //   connectionString: '',
  // },
  // logger: {
  //   streams: [],
  // },
  // storage: {
  //   type: '',
  //   folder: '',
  // },
  // firebase: {
  //   serviceAccount: {
  //     'type': 'service_account',
  //     'project_id': '',
  //     'private_key_id': '',
  //     'private_key': '',
  //     'client_email': '',
  //     'client_id': '',
  //     'auth_uri': '',
  //     'token_uri': '',
  //     'auth_provider_x509_cert_url': '',
  //     'client_x509_cert_url': '',
  //   },
  //   databaseURL: '',
  // },
  // upload: {
  //   allowImageExt: /\.(gif|jpg|jpeg|tiff|png|JPG|PNG|JPEG|GIF|TIFF)$/,
  // },
  // defaultPassword: '12345678',
  // imageSize: 2,
  ...overrideConfig,
};
