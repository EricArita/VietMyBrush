import { NotificationInputError, EntityNotFoundError, validateQuery, ensurePermission, validatePayload, validateOperation } from '@app/core';
import { NotificationService, PERMISSIONS } from '@app/notification';
import * as yup from 'yup';
// import { notificationRepository } from './notification.repository';

// @ts-ignore
const notificationService: NotificationService = {
  setup: (_app, _path) => {
    //
  },
  find: async ({ query, repository, authUser }) => {
    if (!query.operation) {
      // 1. authorize
      ensurePermission(authUser, PERMISSIONS.NOTIFICATION.VIEW);

      // 2. validate
      validateQuery(query);

      // 3. do business logic

      // 4. persist to db
      return await repository.find(query);
    } else {
      validateOperation(query.operation, ['getAllRecords']);
      return await notificationService[query.operation]({ query, repository, authUser });
    }
  },
  getAllRecords: async ({ query, repository, authUser }) => {
    // 1. authorize
    ensurePermission(authUser, PERMISSIONS.NOTIFICATION.VIEW);

    // 2. validate

    // 3. do business logic

    // 4. persist to db
    const data = await repository.findAll(query);
    return await {
      data,
    };
  },
  get: async (_id, params) => {
    // 1. authorize
    ensurePermission(params.authUser, PERMISSIONS.NOTIFICATION.VIEW);

    // 2. validate
    if (!_id) {
      throw new NotificationInputError(params.translate('missingId'));
    }

    // 3. do business logic

    // 4. persist to db
    return await params.repository.findById(_id);
  },
  create: async (data, params) => {
    // 1. authorize
    ensurePermission(params.authUser, PERMISSIONS.NOTIFICATION.CREATE);

    // 2. validate
    await validatePayload({
      // Validate object
    }, data);

    // 3. do business logic

    // 4. persist to db
    const _id = await params.repository.create({
      ...data,
      ...params.creationInfo,
    });

    return {
      id : _id,
      _id,
    };
  },
  patch: async (id, data, params) => {
    validateOperation(data.operation, ['updateDetail']);
    await notificationService[data.operation](id, data.payload, params);
    return {};
  },
  updateDetail: async (_id, data: any, params) => {
    // 1. authorize
    ensurePermission(params.authUser, PERMISSIONS.NOTIFICATION.EDIT);

    // 2. validate
    if (!_id) {
      throw new NotificationInputError(params.translate('missingId'));
    }
    const existedNotification: any = await params.repository.findById(_id);
    if (!existedNotification) {
      throw new EntityNotFoundError('Notification');
    }
    const validationSchema = yup.object().shape({
      //
    });
    await validationSchema.validate(data);
    // 3. do business logic

    // 4. persist to db
    await params.repository.update({
      id: _id,
      ...data,
      ...params.modificationInfo,
    });
    return {};
  },
};

export default notificationService;
