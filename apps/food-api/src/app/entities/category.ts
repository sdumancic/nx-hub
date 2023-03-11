import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '@hub/shared/model/food-models';
import { MealEntity } from './meal';

@Entity({
  name: 'category',
})
export class CategoryEntity implements Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable:true })
  @Index({ unique: true })
  name: string;

  @Column({ name: 'icon_url', nullable: true })
  iconUrl: string;

  @Column({ name: 'active' })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'modified_at', nullable: true })
  modifiedAt: Date;

  @OneToMany(() => MealEntity, (meal) => meal.category)
  meals: MealEntity[];
}
