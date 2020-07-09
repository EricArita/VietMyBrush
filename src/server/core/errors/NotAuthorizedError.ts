import { Forbidden } from '@feathersjs/errors';

export interface NotAuthorizedErrorPermissionParams {
  permission: string;
  type: 'permission';
}

export interface NotAuthorizedErrorRoleParams {
  role: string;
  type: 'role';
}

export interface NotAuthorizedErrorOwnerParams {
  type: 'owner';
}

export interface NotAuthorizedErrorWebhooksParams {
  type: 'webhooks';
}

export class NotAuthorizedError extends Forbidden {
  constructor(params: NotAuthorizedErrorPermissionParams | NotAuthorizedErrorRoleParams | NotAuthorizedErrorOwnerParams | NotAuthorizedErrorWebhooksParams) {
    switch (params.type) {
      case 'permission':
        super(`Not authorized for permission '${params.permission}'`);
        break;
      case 'role':
        super(`Not authorized for role '${params.role}'`);
        break;
      case 'owner':
        super(`Not authorized for owner`);
        break;
      case 'webhooks':
        super(`Not authorized for webhooks`);
        break;
    }
    this.name = 'NotAuthorizedError';
  }
}
