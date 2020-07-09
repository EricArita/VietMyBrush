import { Repository, FindResult } from '@app/core';
import { Notification, FindNotificationQuery } from '@app/notification';

export interface NotificationRepository extends Repository<Notification> {
  find: (query: FindNotificationQuery) => Promise<FindResult<Notification>>;
  findAll: (query: FindNotificationQuery) => any;
  findPendingNotifications: () => Promise<any>;
  updateMany: (query: any, obj: any) => Promise<any>;
}
