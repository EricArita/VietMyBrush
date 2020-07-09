import { Aggregate, IsAuditable } from '@app/core';

export interface Notification extends Aggregate, IsAuditable {
  title: string;
  description: string;
  metadata: any;
  parentId: any;
  status: string;
}
