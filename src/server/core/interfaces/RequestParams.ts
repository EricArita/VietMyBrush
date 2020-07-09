import { AuthUser, IsAuditable, IsDeletable } from '@app/core';

export interface RequestParams<TRepository> {
  translate: (key: string) => string;
  repository: TRepository;
  authUser?: AuthUser;
  creationInfo?: Partial<IsAuditable>;
  modificationInfo?: Partial<IsAuditable>;
  deleteInfo?: Partial<IsDeletable>;
  provider?: any;
  connection?: any;
  query?: any;
}
