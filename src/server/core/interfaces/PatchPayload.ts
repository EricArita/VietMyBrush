export interface PatchPayload<T> {
  operation: string;
  payload: Partial<T>;
}
