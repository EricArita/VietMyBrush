import mongoose from 'mongoose';
import { config } from '@app/config';
import { readdir } from 'fs-extra';
import { rootLocation } from '@app/core';
import { roleRepository } from '@app/auth';

const createDefaultRoles = async () => {
  const rootDir = `${rootLocation}/server/modules`;
  const moduleNames = await readdir(rootDir);
  const excludedModules: string[] = [];
  const permissions: string[] = [];

  for (const moduleName of moduleNames) {
    if (excludedModules.indexOf(moduleName) !== -1) {
      continue;
    }
    const permissionsURL = `../modules/${moduleName}/permissions`;
    try {
      const modulePermissions: any = require(permissionsURL).PERMISSIONS;
      Object.keys(modulePermissions).forEach((aggregate) => {
        Object.keys(modulePermissions[aggregate]).forEach((item) => permissions.push(modulePermissions[aggregate][item]));
      });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log(error);
    }
  }

  const tutor = {
    name: 'tutor',
    description: 'tutor',
    permissions,
    isDefault: false,
    isActive: true,
  };
  const student = {
    name: 'student',
    description: 'student',
    permissions,
    isDefault: true,
    isActive: true,
  };

  const array = [await roleRepository.create(tutor as any), await roleRepository.create(student as any)];
  return Promise.all(array);
};

const initDefaultRoles = async () => {
  try {
    await mongoose.connect(config.database.connectionString, { useNewUrlParser: true });
    await createDefaultRoles();
    process.exit();
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log(error);
    process.exit();
  }
};

initDefaultRoles();
