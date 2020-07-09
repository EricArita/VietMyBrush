import { Schema, SchemaDefinition, Types, connect, model, DocumentQuery, Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Aggregate, PaginationQuery, encodeBase64 } from '@app/core';
import _ from 'lodash';

export const startDatabase = async (connectionString: string) => {
  await connect(connectionString, { useNewUrlParser: true, autoIndex: false, useFindAndModify: false });
};

export const getId = () => new Types.ObjectId().toString();

export const removeId = <T extends Aggregate>(entity: T): T => {
  const savedEntity = { ...entity };
  delete savedEntity.id;
  return savedEntity;
};

export const addIsAuditableSchema = (schema: SchemaDefinition): SchemaDefinition => {
  return {
    ...schema,
    createdBy: String,
    createdAt: Number,
    lastModifiedBy: String,
    lastModifiedAt: Number,
  };
};

export const addIsDeletableSchema = (schema: SchemaDefinition): SchemaDefinition => {
  return {
    ...schema,
    deletedBy: String,
    deletedAt: Number,
    isDeleted: String,
  };
};

export const getPaginationResult = async <T extends Aggregate>(query: PaginationQuery, mongoQuery: DocumentQuery<Document[], Document, {}>) => {
  const paginationMongoQuery = query.first
    ? mongoQuery.limit(query.first + 1)
    : query.last
      ? mongoQuery.limit(query.last + 1)
      : mongoQuery;
  const [fieldToOrder] = query.orderBy ? query.orderBy.split('_') : [undefined];
  const documents = await paginationMongoQuery.exec() as any as T[];
  const edges = documents.filter((_document, index) => index < documents.length - 1)
    .map((document) => ({ node: document }));
  const cursor = fieldToOrder ? encodeBase64({ [fieldToOrder]: documents[documents.length - 1][fieldToOrder] }) : undefined;

  return query.first
    ? {
      edges,
      pageInfo: {
        hasNextPage: query.first > documents.length,
        endCursor: cursor,
      },
    }
    : query.last
      ? {
        edges,
        pageInfo: {
          hasNextPage: query.last > documents.length,
          endCursor: cursor,
        },
      }
      : {
        edges,
        pageInfo: {
        },
      };
};

export {
  Schema,
  ObjectId,
  model,
};
