import { PermissionsService } from './interfaces/PermissionsService';
import { readdir } from 'fs-extra';
import { rootLocation, logger } from '@app/core';

const permissionsService: PermissionsService = {
  find: async (_params) => {
    const result: any = {};
    const rootDir = `${rootLocation}/server/modules`;
    const moduleNames = await readdir(rootDir);
    const excludedModules: string[] = [];

    for (const moduleName of moduleNames.sort()) {
      if (excludedModules.indexOf(moduleName) !== -1) {
        continue;
      }
      logger.info(`Loading '${moduleName}' permissons ...`);
      try {
        const permissions = require(`../../../${moduleName}/permissions`).PERMISSIONS;
        result[moduleName] = permissions;
      } catch (error) {
        // ignore if not found module
      }
    }

    return result;
  },
};

export default permissionsService;
