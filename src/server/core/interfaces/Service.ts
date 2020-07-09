import { Nullable, Aggregate, RequestParams, FindResult, PatchPayload, FindQuery } from '@app/core';

export interface Service<TAggregate extends Aggregate, TQuery extends FindQuery, TRepository> {
  find?: (params: RequestParams<TRepository> & { query: TQuery }) => Promise<FindResult<TAggregate>> | Promise<{}>;
  get?: (id: string, params: RequestParams<TRepository>) => Promise<Nullable<TAggregate>>;
  create?: (data: TAggregate, params: RequestParams<TRepository>) => Promise<{ id: string }>;
  update?: (id: string, data: TAggregate, params: RequestParams<TRepository>) => Promise<{}>;
  patch?: (id: string, data: PatchPayload<TAggregate>, params: RequestParams<TRepository>) => Promise<{}>;
  remove?: (id: string, params: RequestParams<TRepository>) => Promise<{}>;
  getAll?: (params: RequestParams<TRepository> & { query: TQuery }) => Promise<FindResult<TAggregate>>;
}
