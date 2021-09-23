export interface IUser {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive?: boolean;
  accessLevel?: string;
  tokens?: [];
}
