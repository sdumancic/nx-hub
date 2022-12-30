export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  passwordHash: string;
  passwordSalt: string;
  pictureUrl: string;
  active: boolean;
  createdAt: Date;
  modifiedAt: Date;
}
