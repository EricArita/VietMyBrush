import { FindQuery } from '@app/core';

export interface FindNotificationQuery extends FindQuery {
  search?: string;
  filter?: any;
}
