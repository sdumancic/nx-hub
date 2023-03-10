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
  @CreateDateColumn({name:'created_at'})
  createdAt: Date;
  @Column({name:'description'})
  description: string;
  @UpdateDateColumn({name:'modified_at', nullable: true})
  modifiedAt: Date;

  @OneToMany(() => UserRoleEntity, userRole => userRole.role)
  userRoles: UserRoleEntity[]

  @OneToMany(() => RolePermissionEntity, rolePermission => rolePermission.role)
  rolePermissions: RolePermissionEntity[]
}
