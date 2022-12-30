import {
  Column,
  CreateDateColumn,
  Entity,
  Index, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Role } from '@hub/shared/model/food-models';
import { UserRoleEntity } from "./user-role";
import { RolePermissionEntity } from "./role-permission";

@Entity({
  name: 'role',
})
export class RoleEntity implements Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  name: string;

  @Column()
  active: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @Column()
  description: string;
  @UpdateDateColumn()
  modifiedAt: Date;

  @OneToMany(() => UserRoleEntity, userRole => userRole.role)
  userRoles: UserRoleEntity[]

  @OneToMany(() => RolePermissionEntity, rolePermission => rolePermission.role)
  rolePermissions: RolePermissionEntity[]
}
