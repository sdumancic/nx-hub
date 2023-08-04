import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Meal } from "@hub/shared/model/food-models";
import { CategoryEntity } from "./category";
import { OrderItemEntity } from "./order-item";
import { MealToppingEntity } from "./meal-topping";

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
  imageUrl: string;

  @Column()
  @Index({ unique: true })
  name: string;

  @Column({type: "decimal", precision: 10, scale: 2, default: 0, nullable: true})
  price: number;
  @Column({type: "decimal", precision: 10, scale: 2, default: 0, nullable: true})
  rating: number;

  @CreateDateColumn({name:'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name:'modified_at', nullable:false})
  modifiedAt: Date;

  @ManyToOne(() => CategoryEntity, (category) => category.meals)
  @JoinColumn({
    name: 'categoryId',
  })
  category: CategoryEntity;

  @OneToMany(() => MealToppingEntity, mealTopping => mealTopping.meal)
  public mealToppings!: MealToppingEntity[];

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.meal)
  meals: OrderItemEntity[]
}
