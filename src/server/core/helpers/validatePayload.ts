
import * as yup from 'yup';
import { UserInputError } from '../errors/UserInputError';

export const validatePayload = async (rules: yup.ObjectSchemaDefinition<{}>, data: object) => {
  try {
    const validationSchema = yup.object().shape(rules);
    await validationSchema.validate(data);
  } catch (error) {
    throw new UserInputError(error.message);
  }
};
