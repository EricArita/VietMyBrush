// import admin from 'firebase-admin';
// import { getServiceProxy } from '../services';

import fetch from 'node-fetch';
import { config } from '@client/config';

export const authenticate = async (req: any, _res: any, next: any) => {
  if (req.url.indexOf('/refresh-token') === -1) {
    const bearerToken = req.cookies.token || req.headers.authorization;
    if (bearerToken) {
      try {
        const bodyRequest = {
          model: `members/${req.cookies.vietmyuid}?appcode=${config.appCode}&token=${req.cookies.token}`,
          proxy: config.url.proxy,
          method: 'get',
        };
        const controller = 'api/Clusters/request';
        const url = `${config.url.proxy}${controller}`;

        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            appcode: config.appCode,
            token: bearerToken,
          },
          body: JSON.stringify(bodyRequest),
        })
          .then((response) => response.json())
          .then((ret) => {
            req.authUser = {
              id: ret.res.data[0].id,
              fullName: ret.res.data[0].name,
              email: ret.res.data[0].email,
            };
            next();
          })

          .catch(() => {
            next();
          });
      } catch (error) {
        next();
      }
    } else {
      next();
    }
  } else {
    next();
  }
};
