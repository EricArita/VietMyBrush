import * as yup from 'yup';

interface ValidateFieldInput {
  fieldName: string;
  context: any;
  validateSchema: yup.Schema<any>;
}

export const validateField = (params: ValidateFieldInput) => {
  try {
    params.validateSchema.validateSyncAt(params.fieldName, params.context.values);
    params.context.setFieldError(params.fieldName, '');
  } catch (error) {
    params.context.setFieldError(params.fieldName, error.message);
  }
};
