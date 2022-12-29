import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "@hub/shared/model/food-models";
import { MealEntity } from "./meal";

@Entity({
  name: 'category'
})
export class CategoryEntity implements Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  name: string;

  @Column()
  iconUrl: string;

  @Column()
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date

  @OneToMany(() => MealEntity, meal => meal.category)
  meals: MealEntity[]
}
