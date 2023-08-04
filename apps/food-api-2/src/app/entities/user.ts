import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "@hub/shared/model/food-models";
import { UserRoleEntity } from "./user-role";

@Entity({
  name: 'user'
})
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  email: string;


  @Column({name: 'first_name'})
  firstName: string;

  @Column({name: 'last_name'})
  lastName: string;

  @Column({name: 'address'})
  address: string;

  @Column({name: 'city'})
  city: string;

  @Column({name: 'state'})
  state: string;

  @Column({name: 'password_hash'})
  passwordHash: string;

  @Column({name: 'password_salt'})
  passwordSalt: string;

  @Column({nullable: true, name: 'picture_url'})
  pictureUrl: string;

  @Column({default: true, name:'active'})
  active: boolean;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'modified_at', nullable: true})
  modifiedAt: Date

  @OneToMany(() => UserRoleEntity, userRole => userRole.user)
  userRoles: UserRoleEntity[]
}
