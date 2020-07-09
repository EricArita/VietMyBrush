export const overrideConfig = {
  appName: 'techkids-edu-crm',
  web: {
    cors: {
      whitelistUrls: ['http://localhost:3000', 'http://localhost:3001'],
    },
    api: {
      prefix: '/api',
      docsUrl: '/apiDocs',
      docsJson: '/apiJson',
    },
    log: {
      apiRequest: true,
    },
  },
  database: {
    connectionString: 'mongodb://mindx:20fc0e55a1d148029a7f2c8ee90f72b8@18.139.87.240:27017/edwork?authSource=admin',
  },
  logger: {
    streams: [
      {
        level: 'debug',
        stream: 'process.stdout',
      },
    ],
  },
  storage: {
    type: 'local',
    folder: 'local_storage',
  },
  firebase: {
    serviceAccount: {
      type: 'service_account',
      project_id: 'edwork-90931',
      private_key_id: '66a931c1b584ba839333edb77df762863d67b58e',
      private_key:
        // tslint:disable-next-line:max-line-length
        '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCYyHQ/+u+6EExv\ncYMPBwEP5SbiBUd2JYcHZQZYtmYiXJzhHmblUf7otDgz2rASP9lvxbXMvOfA/4B3\nB871S1v/KOIKcvTu/KCyS6tXqu3m3Ziuk4iofQsdxiPl7I0MlrfiMCGEzj3GLj6r\nOCe1nQr7fEaet6y1BJ6qB3g86vOHWwktBd574kYp/3xtu/o2hRGMjerTmTpMHx0W\nKqcgnOKqnks3pJiu/HZ/PpHzdxPvzrwuyHv7Kkh9i/gBcT+OsoBNng1faKvv+6Pr\nAQCPIIOwzF/XQ+tun48ArcsjDWT86Bax8kRr2xSwnIpBRwTUQETUqQiLWJk0Hu06\nf/Gyur/BAgMBAAECggEASXJ4HDfUnfRu4lZF5GgAFTWaoyZZi80PpDjnO6d34wX1\nru1QFub7rb/RkvALG8LRE0APHT0lBm1twwsgbWCMedYcEFziLa+JyxzAYpU75/PY\njfhDxofSW75gjIxS5F3iSVzNCEyjes3Jd8M3p8G2wV4ljvCKmLz/T4rmvRZP+13E\nB+1ROdDInKr83scb3VNxdTD6tU6BqCtIHZhvUV4ZYFogQ+ZplBZIGp9ZdAJu4KZc\nQPT+a41PG2MjWBRzVzyft8ovYaRNUGzQ1VxUB6BBmcMxSncPf43iqjmfD0OXkM4X\nkbq8v04/6/6nj4b9PrB4ueLHNfWPPRvmGD3WlQgG5wKBgQDV6XDSip5Pj82uoh/j\nzEvVMsKPJC/4IjiIoCWzogcSBuQjyx6xby6UbNJkhX35uwgI8NeTHe1xU9sLg+FO\n0GVU01QREO405rGVWp0sqBKm/sdhtKnUsVy7Vz1GdcKy567rIxw1AfQv0wKDKN9T\nQwSX86KXGmbfzHj1/KB85e0DZwKBgQC22AFJO4VYoz3WaQ0D+G4/qjauciFmer4R\nTqigB7/e9hV0uez+Fxeb3ivnU9FaX4Gvu7LLdA74akZxyuxitw/VmWs4yFDQTlO8\nhM00fMosnkjAWeS+JTRHvzKM5qMAaP4YIIqT9SIuKx5zGU+GppPD52ltkDit22mA\ndgZvnvuSlwKBgC09+0u8X7FKI+FsjrwaSGumGbo2mCKt8jELVg4BFee9J2Feo3Y5\noqtnvLPf+/3mjdN+RMnryX1vk+OCmBOYReZD8ALQBuGPbT2+dYGtZoyFVFwY3taK\nUKea0u3lGDHIiJlYyq13ZVL8GQruiRVOFlmhAOFehyWMVIUKUlM4OgG/AoGBAKU7\n1QWyJVIxy1ss+hchdbhRATNqbmam+4a2d8qO1kUOS9t9ff8tLSetgi194I50CsWd\nsPkNe83gdKK3CCI5XrTf/TaGSAnHDwMpXCxXrXje3c3+LqnrAzDnRy5v6tQfDakO\nF02YVHg2fUD0mZqMhLKgOPVLRP1QcCon/q72lFAnAoGBAIyCyWGejt/ZN+0xLaNO\nr0GLUwEqFdvCas+jS2uLnoUtB1DBojAwD/x1RlfQ1VJyNlRP3ofbk9aNns9m0ur+\nS5DM4P1dKhVGcZ8PyjmsEg4frdI5MO6N/OAzuVYb1F6WrUHPENm3xh357CSOl3zT\niEBft4sNdMZHcox3fFzphiKJ\n-----END PRIVATE KEY-----\n',
      client_email: 'firebase-adminsdk-5k7ya@edwork-90931.iam.gserviceaccount.com',
      client_id: '112597852035750376378',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5k7ya%40edwork-90931.iam.gserviceaccount.com',
    },

    databaseURL: 'https://edwork-90931.firebaseio.com',
  },
  webhooks: {
    verifyToken: 'techkids@123',
  },
  emailAccount: {
    resetPassword: {
      account: 'contact@mindx.edu.vn',
      password: 'mindxteam2019',
    },
  },
  resetPasswordCodeTime: 5 * 60 * 1000,
  imageModule: {
    outdateTime: 2 * 60 * 60 * 1000,
  },
  braintree: {
    merchantId: '56hr8dcfb76znq24',
    publicKey: 't4fswsjyr239gzty',
    privateKey: '658de5c31a173edb614a1471a4ee0631',
  },
  apple: {
    clientID: 'com.mindxtech.cindidev.client',
    // tslint:disable-next-line
    clientSecret:
      // tslint:disable-next-line:max-line-length
      'eyJraWQiOiJBMzc4UkE3WUM1IiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiI2SjI1VVpMOExHIiwiaWF0IjoxNTc2MDUxNjE5LCJleHAiOjE1OTE2MDM2MTksImF1ZCI6Imh0dHBzOi8vYXBwbGVpZC5hcHBsZS5jb20iLCJzdWIiOiJjb20ubWluZHh0ZWNoLmNpbmRpZGV2LmNsaWVudCJ9.vzl0Yc7RYcb00r6muqk9MGLql70mw08Rc5FAPROeRkSwoi-IvCkO1yiFwUdYyKk5dpgUZldQZ0qKzdcXM0EiiA',
    redirectUri: 'https://backend.cindidev.mindxtech.com/api/auth/apple-redirect',
  },
  url: {
    client: 'https://cindidev.mindxtech.com/home',
  },
};
