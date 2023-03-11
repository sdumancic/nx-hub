import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { UserRole } from "@hub/shared/model/food-models";
import { UserEntity } from "./user";
import { RoleEntity } from "./role";

@Entity({
  name: 'user-role',
})
@Index(["user", "role"], { unique: true})
export class UserRoleEntity implements UserRole {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'date_assigned' })
  dateAssigned: Date;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;
  @UpdateDateColumn({name: 'modified_at', nullable: true})
  modifiedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.userRoles)
  @JoinColumn({ name: 'user_id' })
  @Index('user-role-user-idx')
  public user!: UserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles)
  @JoinColumn({ name: 'role_id' })
  @Index('user-role-role-idx')
  public role!: RoleEntity;
}
