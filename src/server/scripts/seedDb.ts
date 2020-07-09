import mongoose from 'mongoose';
import { config } from '@app/config';
import { readdir } from 'fs-extra';
import { rootLocation } from '@app/core';
import { roleRepository, userRepository } from '@app/auth';
import admin from 'firebase-admin';

const createAdministratorRole = async () => {
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
        Object.keys(modulePermissions[aggregate]).forEach((item) =>
          permissions.push(modulePermissions[aggregate][item]),
        );
      });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log(error);
    }
  }

  const administrator = {
    name: 'administrator',
    description: 'administrator',
    permissions,
    isDefault: false,
    isActive: true,
  };

  return await roleRepository.create(administrator as any);
};

const createAdministratorUser = async (administratorRoleId: string) => {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.serviceAccount['project_id'],
      clientEmail: config.firebase.serviceAccount['client_email'],
      privateKey: config.firebase.serviceAccount['private_key'],
    }),
    databaseURL: config.firebase.databaseURL,
  });

  const administratorRole = await roleRepository.findById(administratorRoleId);

  let newUser: any;
  try {
    newUser = await admin.auth().createUser({
      email: 'admin@edwork.vn',
      emailVerified: true,
      password: 'admin@123',
      displayName: 'admin@123',
    });

    await admin.auth().setCustomUserClaims(newUser.uid, {
      roles: [(administratorRole as any)._id],
      permissions: administratorRole.permissions,
      avatarUrl: '',
    });
  } catch (err) {
    // tslint:disable-next-line
    console.log(err);
  }

  await userRepository.create({
    id: newUser.uid,
    email: newUser.email,
    phoneNo: newUser.phoneNumber,
    familyName: 'Edwork',
    givenName: 'Admin',
    fullName: 'Edwork Admin',
    loginDetail: {
      email: newUser.email,
      provider: 'email',
    } as any,
    roles: [(administratorRole as any)._id],
    createdAt: new Date().getTime(),
    createdBy: 'edwork-admin',
    isActive: true,
    completeSignUp: false,
  } as any);
};

const seedDb = async () => {
  try {
    await mongoose.connect(config.database.connectionString, { useNewUrlParser: true });
    const administratorRoleId = await createAdministratorRole();
    await createAdministratorUser(administratorRoleId);
    process.exit();
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log(error);
    process.exit();
  }
};

seedDb();
