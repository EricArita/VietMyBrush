import { RequestParams, Service } from '@app/core';
import { Notification, FindNotificationQuery, NotificationRepository } from '@app/notification';

export interface NotificationService extends Service<Notification, FindNotificationQuery, NotificationRepository> {
  setup: (app: any, path: string) => any;
  updateDetail: (id: string, data: Partial<Notification>, params: RequestParams<NotificationRepository>) => Promise<{}>;
  getAllRecords: (params: RequestParams<NotificationRepository>) => Promise<{data: any[]}>;
}
