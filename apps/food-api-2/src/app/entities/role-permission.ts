import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolePermission } from "@hub/shared/model/food-models";
import { PermissionEntity } from "./permission";
import { RoleEntity } from "./role";


@Entity({
  name: 'role-permission',
})
@Index(["permission", "role"], { unique: true})
export class RolePermissionEntity implements RolePermission{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PermissionEntity, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;

  @ManyToOne(() => RoleEntity, (role) => role.rolePermissions)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

}
