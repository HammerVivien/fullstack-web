export interface User {
  id?: number,
  username: string;
  password?: string;
  role: UserRole
}

export enum UserRole {
  Guest = "GUEST",
  User = "USER",
  Admin = "ADMIN",
}
