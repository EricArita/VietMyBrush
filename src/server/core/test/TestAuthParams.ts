import { RequestParams, FindQuery, FindResult, PatchPayload } from '@app/core';

export interface FindMethodParams {
  translate: (key: string) => string;
  permission: string;
  operationType: 'find';
  find: (params: RequestParams<any> & { query: FindQuery }) => Promise<FindResult<any>>;
  query: FindQuery;
}

export interface CreateMethodParams {
  translate: (key: string) => string;
  permission: string;
  operationType: 'create';
  create: (data: any, params: RequestParams<any>) => Promise<{ id: string }>;
}

export interface PatchMethodParams {
  translate: (key: string) => string;
  permission: string;
  operationType: 'patch';
  operation: string;
  patch: (id: string, data: PatchPayload<any>, params: RequestParams<any>) => Promise<{}>;
}

export type TestAuthParams
  = FindMethodParams
  | CreateMethodParams
  | PatchMethodParams;
