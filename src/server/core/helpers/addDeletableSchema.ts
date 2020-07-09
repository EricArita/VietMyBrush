import { SchemaDefinition } from 'mongoose';

export const addDeletableSchema = (definition: SchemaDefinition): SchemaDefinition => {
  return {
    ...definition,
    deletedBy: {
      type: String,
      ref: 'User',
    },
    deletedAt: Number,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  };
};
