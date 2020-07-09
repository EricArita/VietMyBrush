import { addDeletableSchema, addAuditableSchema, NotImplementedError, execCursorPaging } from '@app/core';
import mongoose from 'mongoose';
import { UsersRepository } from './interfaces/UsersRepository';
import cache from 'memory-cache';
// import { imageService } from '@app/website';

const UsersSchema = new mongoose.Schema(
  addAuditableSchema(
    addDeletableSchema({
      _id: String,
      email: String,
      familyName: String,
      givenName: String,
      fullName: String,
      phoneNumber: String,
      address: String,
      description: String,
      about: String,
      avatar: String,
      dob: Number,
      gender: String,
      loginDetail: Object,
      loginMethods: Array,
      resetPasscode: Object,
      roles: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
        default: [],
      },
      completeSignUp: {
        type: Boolean,
        default: false,
      },
      deviceToken: Array,
      appleIdentifierId: {
        type: String,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    }),
  ),
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);

UsersSchema.virtual('id').get(function () {
  // @ts-ignore
  return this._id;
});
UsersSchema.index(
  { fullName: 'text', familyName: 'text', givenName: 'text', email: 'text' },
  { name: 'coreIndex', default_language: 'en', language_override: 'en' },
);
const UsersModel = mongoose.model('User', UsersSchema);
UsersModel.createIndexes();

export const userRepository: UsersRepository = {
  findByRole: async (role: string) => {
    return (await UsersModel.find({ roles: role }).populate('roles').exec()) as any;
  },
  findById: async (id) => {
    return (await UsersModel.findById(id).populate('roles', '_id name').exec()) as any;
  },
  findOne: async (query) => {
    return (await UsersModel.findOne(query).exec()) as any;
  },
  findAll: async () => {
    return (await UsersModel.find({})) as any;
  },
  find: async (query) => {
    const filters: any[] = [];
    if (query.search) {
      filters.push({ $text: { $search: query.search } });
    }
    if (query.roles && query.roles.length > 0) {
      filters.push({
        roles: { $all: query.roles },
      });
    }
    if (query.filter && query.filter.length > 0) {
      query.filter.forEach((val: any) => {
        if (val.split('|').length > 1) {
          filters.push({ [val.split('|')[0]]: val.split('|')[1] === 'null' ? null : val.split('|')[1] });
        } else if (val.split('%').length > 1) {
          filters.push({ [val.split('%')[0]]: val.split('%')[1] === 'null' ? null : JSON.parse(val.split('%')[1]) });
        }
      });
    }

    return await execCursorPaging(
      UsersModel,
      filters,
      query.sortBy,
      Number(query.first),
      ['roles'],
      query.before,
      query.after,
      true,
    );
  },
  count: async (_query) => {
    throw new NotImplementedError();
  },
  create: async (payload) => {
    if (payload.gender) {
      payload.gender = payload.gender.toUpperCase() as any;
    }

    // if (payload.avatar && payload.avatar.indexOf('http') < 0 && payload.avatar.indexOf('resize') < 0) {
    //   await imageService.moveFilesToUploadFolder(payload.avatar);

    //   // Delete records in temporaryImage collection
    //   await imageService.deleteByUrl(payload.avatar);
    //   const lastDot = payload.avatar.lastIndexOf('.');
    //   const fileHash = payload.avatar.slice(0, lastDot).trim();
    //   payload.avatar = `/upload/${fileHash}-resize.jpg`;
    // }

    const newUser = new UsersModel({
      ...payload,
      _id: payload.id,
    });
    await newUser.save();
    return newUser.id;
  },
  update: async (payload) => {
    if (payload.gender) {
      payload.gender = payload.gender.toUpperCase() as any;
    }

    // if (payload.avatar && payload.avatar.indexOf('http') < 0 && payload.avatar.indexOf('resize') < 0) {
    //   await imageService.moveFilesToUploadFolder(payload.avatar);

    //   // Delete records in temporaryImage collection
    //   await imageService.deleteByUrl(payload.avatar);
    //   const lastDot = payload.avatar.lastIndexOf('.');
    //   const fileHash = payload.avatar.slice(0, lastDot).trim();
    //   payload.avatar = `/upload/${fileHash}-resize.jpg`;
    // }

    if (payload.unset) {
      await UsersModel.findByIdAndUpdate(payload.id, { $set: payload, $unset: payload.unset }).exec();
    } else {
      await UsersModel.findByIdAndUpdate(payload.id, { $set: payload }).exec();
    }
  },
  del: async (_id): Promise<void> => {
    throw new NotImplementedError();
  },
  ensureIndexes: async () => {
    UsersSchema.index({ email: 'text', fullName: 'text', phoneNo: 'text' });
    UsersModel.createIndexes();
  },
  getPermissions: async (id) => {
    const cachedValue = cache.get('PERMISSIONS_' + id);
    if (cachedValue) return cachedValue;
    else {
      const user = (await UsersModel.findById(id).populate('roles').exec()) as any;
      if (user) {
        const permissions = user.roles.reduce((sum: any, val: any) => {
          return [...sum, ...val.permissions];
        }, []);
        cache.put('PERMISSIONS_' + id, permissions);
        return permissions;
      } else {
        return [];
      }
    }
  },
  removeDeviceToken: async (id, deviceToken) => {
    return await UsersModel.findByIdAndUpdate(id, { $pull: { deviceToken } }).exec();
  },
};
