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
import { MealEntity } from "./meal";
import { ToppingEntity } from "./topping";

@Entity({
  name: 'meal_topping',
})
@Index(["mealId", "toppingId"], { unique: true})
export class MealToppingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'meal_id'})
  public mealId!: number

  @Column({name: 'topping_id'})
  public toppingId!: number

  @Column({name: 'active'})
  active: boolean;

  @Column({type: "decimal", precision: 10, scale: 2, default: 0, nullable: true, name: 'price'})
  price: number;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'modified_at'})
  modifiedAt: Date;


  @ManyToOne(() => MealEntity, (meal) => meal.mealToppings)
  @JoinColumn({name: 'meal_id'})
  @Index("meal-topping-meal-idx")
  public meal!: MealEntity

  @ManyToOne(() => ToppingEntity, (topping) => topping.mealToppings)
  @JoinColumn({name: 'topping_id'})
  @Index("meal-topping-topping-idx")
  public topping!: ToppingEntity

}
