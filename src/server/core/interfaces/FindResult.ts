export interface FindResult<T> {
  data: T[];
  before?: any; // query previous page
  after?: any; // query next page
}
