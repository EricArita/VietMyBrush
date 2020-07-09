import { config } from '@app/config';

export const storage = (): Storage => {
  return require(`./${config.storage.type}.storage`);
};
