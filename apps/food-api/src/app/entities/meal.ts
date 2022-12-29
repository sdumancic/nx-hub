import {
  Column,
  CreateDateColumn,
  Entity, Index,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Meal } from '@hub/shared/model/food-models';
import { CategoryEntity } from './category';
import { MealToppingEntity } from "./meal-topping";
import { MealOrderItemEntity } from "./meal-order-item";

@Entity({
  name: 'meal',
})
export class MealEntity implements Meal {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  active: boolean;
  @Column({nullable: true})
  calories: number;

  @Column({nullable: true})
  description: string;
  @Column({nullable: true})
  iconUrl1: string;
  @Column({nullable: true})
  iconUrl2: string;
  @Column({nullable: true})
  iconUrl3: string;

  @Column()
  @Index({ unique: true })
  name: string;

  @Column({type: "decimal", precision: 10, scale: 2, default: 0, nullable: true})
  price: number;
  @Column({type: "decimal", precision: 10, scale: 2, default: 0, nullable: true})
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @ManyToOne(() => CategoryEntity, (category) => category.meals)
  @JoinColumn({
    name: 'categoryId',
  })
  category: CategoryEntity;

  @OneToMany(() => MealToppingEntity, mealTopping => mealTopping.meal)
  public mealToppings!: MealToppingEntity[];

  @OneToMany(() => MealOrderItemEntity, (orderItem) => orderItem.meal)
  meals: MealOrderItemEntity[]
}
