import { addIsAuditableSchema, addIsDeletableSchema, ObjectId, Schema, model, getPaginationResult, startDatabase } from './mongo.database';

export const mongoDatabase = {
    addIsAuditableSchema,
    addIsDeletableSchema,
    ObjectId,
    Schema,
    model,
    getPaginationResult,
    startDatabase,
};
