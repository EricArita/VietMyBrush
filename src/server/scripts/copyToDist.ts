import { copy, readdir } from 'fs-extra';

// tslint:disable:no-console
const copyToDist = async () => {
  const copyPromises = [
    copy('src/client/.next', 'dist/client/.next/'),
    copy('src/client/static', 'dist/client/static/'),
    copy('src/client/custom-antd.less', 'dist/client/custom-antd.less'),
    copy('src/server/config', 'dist/server/config/'),
    copy('src/server/locales', 'dist/server/locales/'),
    copy('src/server/swagger.yaml', 'dist/server/swagger.yaml'),
  ];

  const moduleNames = await readdir(`src/server/modules`);
  const excludedModules: string[] = ['website'];
  for (const module of moduleNames) {
    if (excludedModules.indexOf(module) !== -1) {
      continue;
    }
    copyPromises.push(copy(`src/server/modules/${module}/${module}.swagger.yaml`, `dist/server/modules/${module}/${module}.swagger.yaml`));
  }

  try {
    await Promise.all(copyPromises);
  } catch (error) {
    console.log(error);
  }
};

copyToDist().then(() => {
  console.log('Copy files success');
  process.exit();
});
