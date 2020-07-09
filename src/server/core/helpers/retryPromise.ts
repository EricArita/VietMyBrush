import { promiseTimeout } from '@app/core';

export const retryPromise = async <T>(promise: Promise<T>, times = 3, timeout = 30000): Promise<T | undefined> => {
  let count = 1;
  if (times < 0) {
    throw Error('invalid times to retry promise');
  }
  if (timeout < 0) {
    throw Error('invalid timeout to retry promise');
  }
  while (count <= times) {
    try {
      return await promiseTimeout(promise, timeout);
    }
    catch (ex) {
      if (count < times) {
        count++;
      } else {
        throw ex;
      }
    }
  }
  return undefined;
};
