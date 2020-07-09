export const buildPermissionsTree = (permissions: any) => {
  // calculate module permissions
  const modulePermissions: any = {};
  Object.keys(permissions).forEach((module) => {
    let modulePermission: string[] = [];
    Object.keys(permissions[module]).forEach((aggregate) => {
      const aggregatePermissions: string[] = [];
      Object.keys(permissions[module][aggregate]).map((item: string) => aggregatePermissions.push(permissions[module][aggregate][item]));
      modulePermission = [...modulePermission, ...aggregatePermissions];
    });
    modulePermissions[module] = modulePermission;
  });

  return Object.keys(permissions).map((module) => ({
    key: module,
    name: module.toUpperCase(),
    value: modulePermissions[module],
    children: Object.keys(permissions[module]).map((aggregate) => ({
      key: aggregate,
      name: aggregate.toUpperCase(),
      value: Object.keys(permissions[module][aggregate]).map((permission) => permissions[module][aggregate][permission]),
      children:  Object.keys(permissions[module][aggregate]).map((item) => ({
        key: permissions[module][aggregate][item],
        name: permissions[module][aggregate][item].toUpperCase(),
        value: [permissions[module][aggregate][item]],
      })),
    })),
  }));
};
