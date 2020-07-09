export interface AuthUser {
  id: string;
  permissions: string[];
  roles: string[];
  fullName?: string;
  campusId?: string;
}
