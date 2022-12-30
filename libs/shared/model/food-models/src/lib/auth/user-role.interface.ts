import { User } from "./user.interface";
import { Role } from "./role.interface";

export interface UserRole {
  id: number;
  user: User;
  role: Role;
  dateAssigned: Date;
  createdAt: Date;
  modifiedAt: Date;
}
