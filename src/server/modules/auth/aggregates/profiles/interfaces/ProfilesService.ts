import { Service, RequestParams } from '@app/core';
import { User, FindUsersQuery, UsersRepository } from '@app/auth';

export interface ProfilesService extends Service<User, FindUsersQuery, UsersRepository> {
  updateDetail: (id: string, data: Partial<User>, params: RequestParams<UsersRepository>) => Promise<{}>;
  updateAvatar: (id: string, data: Partial<User>, params: RequestParams<UsersRepository>) => Promise<{}>;
  changePassword: (id: string, data: {newPassword: string}, params: RequestParams<UsersRepository>) => Promise<{}>;
}
