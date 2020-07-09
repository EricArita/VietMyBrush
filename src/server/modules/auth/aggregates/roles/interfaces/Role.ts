import { Aggregate, IsAuditable, IsDeletable } from '@app/core';

export interface Role extends Aggregate, IsAuditable, IsDeletable {
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}
