import { TimestampInMilliseconds, UserId } from '@app/core';

/**
 * Interface for auditable objects with creation & modification info
 */
export interface IsAuditable {
  createdBy?: UserId;
  createdAt?: TimestampInMilliseconds;
  lastModifiedBy?: UserId;
  lastModifiedAt?: TimestampInMilliseconds;
}
