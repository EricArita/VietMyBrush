import { UserInputError, EntityNotFoundError, validateQuery, ensurePermission, validatePayload, validateOperation, logger } from '@app/core';
import { PERMISSIONS, UsersService, addFullName } from '@app/auth';
import * as yup from 'yup';
import admin from 'firebase-admin';
import { Response } from 'express';
import { userRepository } from './users.repository';
import cache from 'memory-cache';
import _ from 'lodash';

// const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
const usersService: UsersService = {
  setup: (app, path) => {
    app.get(path + '/check-email-exist/:email', async (req: any, res: Response) => {
      try {
        const { email } = req.params;
        const existedEmail = await userRepository.findOne({email});
        res.status(200).json({
          emailExist: Boolean(existedEmail),
          provider: existedEmail && existedEmail.loginDetail ? existedEmail.loginDetail : null,
          loginMethods: existedEmail && existedEmail.loginMethods || [],
        });
      } catch (error) {
        logger.error(error);
        res.status(error.status || 500).end(error.message || req.t('internalServerError'));
      }
    });

    app.get(path + '/get-permissions/:id', async (req: any, res: Response) => {
      try {
        const permissions = await userRepository.getPermissions(req.params.id);
        res.status(200).json({
          data: permissions,
        });
      } catch (error) {
        logger.error(error);
        res.status(error.status || 500).end(error.message || req.t('internalServerError'));
      }
    });

    app.get(path + '/get-by-apple-id/:id', async (req: any, res: Response) => {
      try {
        const result = await userRepository.findOne({
          appleIdentifierId: req.params.id});
        res.status(200).json({
          data: result,
        });
      } catch (error) {
        logger.error(error);
        res.status(error.status || 500).end(error.message || req.t('internalServerError'));
      }
    });
  },
  find: async ({ query, repository, authUser }) => {
    // 1. authorize
    query.fallbackCampus = authUser ? authUser.campusId : undefined;

    // 2. validate
    validateQuery(query);

    // 3. do business logic

    // 4. persist to db
    const data = await repository.find(query) as any;

    // Query class count

    return {
      ...data,
      data: JSON.parse(JSON.stringify(data.data)).map((user: any) => {
        return user;
      }),
    };
  },
  get: async (id, params) => {
    // 2. validate
    if (!id) {
      throw new UserInputError(params.translate('missingId'));
    }

    // 3. do business logic

    // 4. persist to db
    const user = await params.repository.findById(id);
    if (user) {
      const data = JSON.parse(JSON.stringify(user));
      delete data.resetPasscode;
      return data;
    } else {
      throw new EntityNotFoundError('User');
    }
  },
  create: async (data, params) => {
    // 1. authorize
    ensurePermission(params.authUser, PERMISSIONS.USERS.CREATE);

    // 2. validate
    await validatePayload({
      email: yup.string().email(params.translate('invalidEmail')).required(params.translate('emailRequired')),
      password: yup.string()
      .required(params.translate('passwordRequired')),
      roles: yup.array(),
      familyName: yup.string()
      .required(params.translate('familyNameRequired'))
      .min(2, params.translate('tooShort'))
      .max(50, params.translate('tooLong')),
      givenName: yup.string()
      .required(params.translate('givenNameRequired'))
      .min(2, params.translate('tooShort'))
      .max(50, params.translate('tooLong')),
    }, data);
    const existedUser = await params.repository.findOne({email: data.email});
    if (existedUser) {
      throw new UserInputError(params.translate('emailExist'));
    }

    // 3. do business logic
    const newUser = await admin.auth().createUser({
      email: data.email,
      password: data.password,
      emailVerified: true,
    });

    await admin.auth().setCustomUserClaims(newUser.uid, {
      roles: data.roles,
      avatarUrl: '',
      name: addFullName({ familyName: data.familyName!, givenName: data.givenName!, type: 'familyNameFirst' }),
    });

    // 4. persist to db
    const id = await params.repository.create({
      id: newUser.uid,
      ...data,
      ...params.creationInfo,
      loginDetail: {
        email: data.email,
        provider: 'email',
      },
      fullName: addFullName({ familyName: data.familyName!, givenName: data.givenName!, type: 'familyNameFirst' }),
    });

    return {
      id,
    };
  },
  patch: async (id, data, params) => {
    validateOperation(data.operation, ['updateDetail', 'activate', 'deactivate']);
    await usersService[data.operation](id, data.payload, params);
    return {};
  },
  updateDetail: async (id, data: any, params) => {
    // 1. authorize
    ensurePermission(params.authUser, PERMISSIONS.USERS.EDIT);

    // 2. validate
    if (!id) {
      throw new UserInputError(params.translate('missingId'));
    }
    const existedUser: any = await params.repository.findById(id);
    if (!existedUser) {
      throw new EntityNotFoundError('User');
    }
    const validationSchema = yup.object().shape({
      email: yup.string().email(params.translate('invalidEmail')),
      familyName: yup.string()
      .min(2, params.translate('tooShort'))
      .max(50, params.translate('tooLong')),
      givenName: yup.string()
      .min(2, params.translate('tooShort'))
      .max(50, params.translate('tooLong')),
      roles: yup.array(),
    });
    await validationSchema.validate(data);
    if (data.email) {
      const emailExist = await params.repository.findOne({email: data.email});
      if (emailExist && emailExist.id !== id) {
        throw new UserInputError(params.translate('emailExist'));
      }
    }

    // 3. do business logic
    if (data.email) {
      await admin.auth().updateUser(existedUser._id, {
        email: data.email,
      });
    }
    if (data.password) {
      await admin.auth().updateUser(existedUser._id, {
        password: data.password,
      });
    }
    if (data.roles && data.roles.length > 0) {
      await admin.auth().setCustomUserClaims(existedUser._id, {
        roles: data.roles,
      });
    }
    cache.del('PERMISSIONS_' + id);

    if (data.fullName) {
      data.familyName = data.fullName ? data.fullName.split(' ')[0] : '';
      data.givenName = data.fullName ? data.fullName.split(' ').slice(1, data.fullName.split(' ').length).join(' ') : '';
      await admin.auth().updateUser(existedUser._id, {
        displayName: data.fullName,
      });
    }
    else if (data.familyName || data.givenName) {
      await admin.auth().updateUser(existedUser._id, {
        displayName: addFullName({ familyName: data.familyName || existedUser.familyName, givenName: data.givenName || existedUser.givenName, type: 'familyNameFirst' }),
      });
      data.fullName = addFullName({ familyName: data.familyName || existedUser.familyName, givenName: data.givenName || existedUser.givenName, type: 'familyNameFirst' });
    }

    if (data.fullName) {
      await admin.auth().setCustomUserClaims(existedUser._id, {
        name: data.fullName,
      });
    }

    data.hourlyRate = {
      ...existedUser.hourlyRate,
      ...data.hourlyRate,
    };

    // tslint:disable-next-line
    data.hourlyRate.average = Math.round(((data.hourlyRate.priceForThirtyMinutes || 0) / 0.5 + (data.hourlyRate.priceForSixtyMinutes || 0) + (data.hourlyRate.priceForNinetyMinutes || 0) / 1.5) / 3);

    // 4. persist to db
    await params.repository.update({
      id,
      ...data,
      ...params.modificationInfo,
    });
    return {};
  },
  activate: async (id, _data, params) => {
    // 1. authorize
    ensurePermission(params.authUser, PERMISSIONS.USERS.EDIT);

    // 2. validate
    if (!id) {
      throw new UserInputError(params.translate('missingId'));
    }
    const existedUser = await params.repository.findById(id);
    if (!existedUser) {
      throw new EntityNotFoundError('User');
    }

    // 3. do business logic
    admin.auth().updateUser(existedUser.id, {
      disabled: false,
      emailVerified: true,
    });

    // 4. persist to db
    await params.repository.update({
      id,
      isActive: true,
      ...params.modificationInfo,
    });

    return {};
  },
  deactivate: async (id, _data, params) => {
    // 1. authorize
    ensurePermission(params.authUser, PERMISSIONS.USERS.EDIT);

    // 2. validate
    if (!id) {
      throw new UserInputError(params.translate('missingId'));
    }
    const existedUser = await params.repository.findById(id);
    if (!existedUser) {
      throw new EntityNotFoundError('User');
    }

    // 3. do business logic
    admin.auth().updateUser(existedUser.id, {
      disabled: true,
    });

    // 4. persist to db
    await params.repository.update({
      id,
      isActive: false,
      ...params.modificationInfo,
    });

    return {};
  },
  getPermissions: async (id) => {
    return await userRepository.getPermissions(id);
  },
  getUser: async (id) => {
    return await userRepository.findById(id);
  },
};

export default usersService;
