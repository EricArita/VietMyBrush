import { TimestampInMilliseconds } from '@app/core';

/**
 * Interface for message in the whole system
 */
export interface Message {
  id: string;
  timestamp: TimestampInMilliseconds;
  type: string;
  data: object;
}
