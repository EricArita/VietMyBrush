import { UserInputError, EntityNotFoundError, ensureOwner, validateOperation } from '@app/core';
import { ProfilesService, addFullName } from '@app/auth';
import * as yup from 'yup';
import admin from 'firebase-admin';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
const phoneNoRegex = /^([+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*){8,}$/;
const profileService: ProfilesService = {
  get: async (id, params) => {
    // 1. authorize
    ensureOwner(params.authUser, id);

    // 2. validate
    if (!id) {
      throw new UserInputError('Invalid query params');
    }

    // 3. do business logic

    // 4. persist to db
    return await params.repository.findById(id);
  },
  patch: async (id, data, params) => {
    validateOperation(data.operation, ['updateDetail', 'updateAvatar', 'changePassword']);
    await profileService[data.operation](id, data.payload, params);
    return {};
  },
  updateDetail: async (id, data, params): Promise<{}> => {
    // 1. authorize
    ensureOwner(params.authUser, id);

    // 2. validate
    if (!id) {
      throw new UserInputError('Invalid query params');
    }
    const existedUser = await params.repository.findById(id);
    if (!existedUser) {
      throw new EntityNotFoundError('User');
    }
    const validationSchema = yup.object().shape({
      familyName: yup.string().min(2, 'Too short').max(50, 'Too long'),
      givenName: yup.string().min(2, 'Too short').max(50, 'Too long'),
      phoneNumber: yup.string().matches(phoneNoRegex, 'Invalid phone number'),
      email: yup.string().email('Invalid email address'),
      address: yup.string().min(20, 'Too short').max(500, 'Too long'),
      description: yup.string().min(20, 'Too short').max(1000, 'Too long'),
    });
    await validationSchema.validate(data);

    // 3. do business logic
    if (data.phoneNumber) {
      admin.auth().updateUser(existedUser.id, {
        phoneNumber: data.phoneNumber,
      });
    }
    if (data.email) {
      admin.auth().updateUser(existedUser.id, {
        email: data.email,
        emailVerified: true,
      });
    }
    if (data.familyName || data.givenName) {
      admin.auth().updateUser(existedUser.id, {
        displayName: addFullName({ familyName: data.familyName! || existedUser.familyName!, givenName: data.givenName! || existedUser.givenName!, type: 'familyNameFirst' }),
      });
    }

    // 4. persist to db
    await params.repository.update({
      id,
      ...data,
      ...params.modificationInfo,
      fullName: addFullName({ familyName: data.familyName! || existedUser.familyName!, givenName: data.givenName! || existedUser.givenName!, type: 'familyNameFirst' }),
    });
    return {};
  },
  updateAvatar: async (id, data, params): Promise<{}> => {
    // 1. authorize
    ensureOwner(params.authUser, id);

    // 2. validate
    if (!id) {
      throw new UserInputError('Invalid query params');
    }
    const existedUser = await params.repository.findById(id);
    if (!existedUser) {
      throw new EntityNotFoundError('User');
    }

    // 3. do business logic

    // 4. persist to db
    await params.repository.update({
      id,
      avatar: data.avatar,
      ...params.modificationInfo,
    });

    return {};
  },
  changePassword: async (id, data, params): Promise<{}> => {
    // 1. authorize
    ensureOwner(params.authUser, id);

    // 2. validate
    if (!id) {
      throw new UserInputError('Invalid query params');
    }
    const existedUser = await params.repository.findById(id);
    if (!existedUser) {
      throw new EntityNotFoundError('User');
    }
    const validationSchema = yup.object().shape({
      newPassword: yup.string().matches(passwordRegex, 'Password must be minimum six characters, at least one letter, one number and one special character'),
    });
    await validationSchema.validate(data);

    // 3. do business logic
    await admin.auth().updateUser(existedUser.id, {
      password: data.newPassword,
    });

    // 4. persist to db
    return {};
  },
};

export default profileService;
