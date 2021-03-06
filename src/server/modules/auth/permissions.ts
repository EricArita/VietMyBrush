export const PERMISSIONS = Object.freeze({
  USERS: {
    VIEW: 'USERS.VIEW',
    CREATE: 'USERS.CREATE',
    EDIT: 'USERS.EDIT',
    VIEW_SYSADMIN: 'USERS.VIEW_SYSADMIN',
    VIEW_ADMIN: 'USERS.VIEW_ADMIN',
    VIEW_TUTOR: 'USERS.VIEW_TUTOR',
    VIEW_STUDENT: 'USERS.VIEW_STUDENT',
  },

  ROLES: {
    VIEW: 'ROLES.VIEW',
    VIEW_SCREEN: 'ROLES.VIEW_SCREEN',
    CREATE: 'ROLES.CREATE',
    EDIT: 'ROLES.EDIT',
    DELETE: 'ROLES.DELETE',
    TUTOR: 'ROLES.TUTOR',
    STUDENT: 'ROLES.STUDENT',
    ADMIN: 'ROLES.ADMIN',
    VIEW_DASHBOARD: 'ROLES.VIEW_DASHBOARD',
  },

  COURSES: {
    VIEW: 'COURSE.VIEW',
    CREATE: 'COURSE.CREATE',
    EDIT: 'COURSE.EDIT',
    DELETE: 'COURSE.DELETE',
  },
  CAMPUSES: {
    VIEW: 'CAMPUS.VIEW',
    CREATE: 'CAMPUS.CREATE',
    EDIT: 'CAMPUS.EDIT',
    DELETE: 'CAMPUS.DELETE',
  },
  CATEGORIES: {
    VIEW: 'CATEGORY.VIEW',
    CREATE: 'CATEGORY.CREATE',
    EDIT: 'CATEGORY.EDIT',
    DELETE: 'CATEGORY.DELETE',
  },
  CLASSES: {
    VIEW: 'CLASS.VIEW',
    CREATE: 'CLASS.CREATE',
    EDIT: 'CLASS.EDIT',
    DELETE: 'CLASS.DELETE',
  },
});
