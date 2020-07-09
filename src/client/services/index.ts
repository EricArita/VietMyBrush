import { ServiceProxy } from './service-proxies';
import { config } from '@client/config';
import fetch from 'isomorphic-fetch';
import 'firebase/auth';

const getAuthHttp = (idToken: string) => {
  return {
    fetch: (url: any, option: any): Promise<Response> => {
      option.headers.Authorization = `${idToken}`;
      return fetch(url, option);
    },
  };
};

const getServiceProxy = (idToken = ''): ServiceProxy => {
  const httpOption = getAuthHttp(idToken);
  return new ServiceProxy(
    config.url.api,
    httpOption,
  );
};

export {
  getServiceProxy,
};
