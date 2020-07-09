import { addDeletableSchema, addAuditableSchema, NotImplementedError, execCursorPaging } from '@app/core';
import mongoose from 'mongoose';
import { NotificationRepository } from './interfaces/NotificationRepository';

const NotificationSchema = new mongoose.Schema(addAuditableSchema(addDeletableSchema({
  title: String,
  data: Object,
  notificationType: String,
  from: {
    type: String,
    ref: 'User',
  },
  to: {
    type: String,
    ref: 'User',
  },
  notifyAt: Number,
  channel: String,
  read: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: 'pending',
  },
})), {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

NotificationSchema.virtual('id').get(function() {
  // @ts-ignore
  return this._id;
});

NotificationSchema.index({ title: 'text' });
const NotificationModel = mongoose.model('Notification', NotificationSchema);
NotificationModel.createIndexes();

export const notificationRepository: NotificationRepository = {
  findById: async (id) => {
    return await NotificationModel.findById(id)
      .exec() as any;
  },
  findOne: async (query: {name?: string}) => {
    return await NotificationModel.findOne({name: query.name}).exec() as any;
  },
  findAll: async(query) => {
    const filters: any[] = [];
    if (query.search) {
      filters.push({ $text: { $search: `"${query.search}"`} });
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
    return await NotificationModel.find(filters.length ? {$and: filters} : {}).exec();
  },
  find: async (query) => {
    const filters: any[] = [];
    if (query.search) {
      filters.push({ $text: { $search: `"${query.search}"`} });
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
      NotificationModel,
      filters,
      query.sortBy,
      Number(query.first),
      [],
      query.before,
      query.after,
    );
  },
  findPendingNotifications: async () => {
    return await NotificationModel.find({status: 'pending', notifyAt: {$lte: Date.now() + 3 * 60 * 1000}}).populate({
      path: 'to',
      select: '_id deviceToken',
    }).exec();
  },
  updateMany: async (query, obj) => {
    return await NotificationModel.updateMany(query, obj).exec();
  },
  count: async (_query) => {
    throw new NotImplementedError();
  },
  create: async (payload) => {
    const newNotification = new NotificationModel({
      ...payload,
    });
    await newNotification.save();
    return newNotification._id;
  },
  update: async (payload) => {
    await NotificationModel.findByIdAndUpdate(payload.id, { $set: payload }).exec();
  },
  del: async (_id): Promise<void> => {
    throw new NotImplementedError();
  },
  ensureIndexes: async () => {
    NotificationSchema.index({ name: 'text' });
    await NotificationModel.createIndexes();
  },
};
