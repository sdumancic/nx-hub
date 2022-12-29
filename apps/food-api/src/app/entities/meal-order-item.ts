import {
  Column,
  CreateDateColumn,
  Entity, Index, JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Meal, MealItem, Order } from "@hub/shared/model/food-models";
import { MealEntity } from "./meal";
import { OrderEntity } from "./order";

@Entity({
  name: 'meal_order_item'
})
export class MealOrderItemEntity implements MealItem {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt: Date
  @ManyToOne(() => MealEntity, (meal) => meal.meals)
  @JoinColumn({name: 'meal_id'})
  @Index("meal-item-meal-idx")
  meal: Meal;
  @Column({type: "decimal", precision: 10, scale: 2, default: 0, name: 'price_no_vat'})
  priceNoVat: number;
  @Column({type: "decimal", precision: 10, scale: 2, default: 0, name: 'price_with_vat'})
  priceWithVat: number;
  @Column({type: "int", default: 1, name: 'quantity'})
  quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.mealItems)
  @JoinColumn({name: 'order_id'})
  @Index("meal-item-order-idx")
  order: Order

}
