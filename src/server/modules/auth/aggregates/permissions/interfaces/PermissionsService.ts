import { RequestParams } from '@app/core';

export interface PermissionsService {
  find: (params: RequestParams<null>) => Promise<any>;
}
