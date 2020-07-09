export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  roles: string | any;
  permissions: any;
  campusId: string;
}

export interface ProfileState {
 authUser: AuthUser|null;
}

export interface ProfileReducers {
  updateProfileInfo: (payload: any) => void;
}

export interface ProfileEffects {}
