import { SchemaDefinition } from 'mongoose';

export const addAuditableSchema = (definition: SchemaDefinition): SchemaDefinition => {
  return {
    ...definition,
    createdBy: {
      type: String,
      ref: 'User',
    },
    createdAt: Number,
    lastModifiedBy: {
      type: String,
      ref: 'User',
    },
    lastModifiedAt: Number,
  };
};
