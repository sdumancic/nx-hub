import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Permission, UserRole } from "@hub/shared/model/food-models";
import { RolePermissionEntity } from "./role-permission";

@Entity({
  name: 'permission',
})
export class PermissionEntity implements Permission {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @Index({ unique: true })
  name: string;
  @Column()
  description: string;

  @Column()
  active: boolean;
  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;
  @UpdateDateColumn({name: 'modified_at', nullable:true})
  modifiedAt: Date;

  @OneToMany(() => RolePermissionEntity, rolePermission => rolePermission.permission)
  rolePermissions: RolePermissionEntity[]

}
