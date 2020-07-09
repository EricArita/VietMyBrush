export const getMenuConfigs = () => {
  return [
    {
      name: 'dashboard',
      icon: 'dashboard',
      path: '/dashboard',
      permission: 'ROLES.VIEW_DASHBOARD',
    },
  ];
};
