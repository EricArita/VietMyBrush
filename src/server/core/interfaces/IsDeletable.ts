import { UserId } from '@app/core';
import { TimestampInMilliseconds } from './TimestampInMilliseconds';

/**
 * Interface for deletable objects with deletion info
 */
export interface IsDeletable {
  deletedBy?: UserId;
  deletedAt?: TimestampInMilliseconds;
  isDeleted: boolean;
}
