import {
  Column,
  CreateDateColumn,
  Entity, Index, JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Meal, OrderItem, Order, ToppingItem } from "@hub/shared/model/food-models";
import { MealEntity } from "./meal";
import { OrderEntity } from "./order";
import { ToppingOrderItemEntity } from "./topping-order-item";

@Entity({
  name: 'order_item'
})
export class OrderItemEntity implements OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'modified_at', 'nullable': true })
  modifiedAt: Date
  @ManyToOne(() => MealEntity, (meal) => meal.meals)
  @JoinColumn({name: 'meal_id'})
  @Index("order-item-meal-idx")
  meal: Meal;
  @Column({type: "decimal", precision: 10, scale: 2, default: 0, name: 'price_no_vat', 'nullable': true  })
  priceNoVat: number;
  @Column({type: "decimal", precision: 10, scale: 2, default: 0, name: 'price_with_vat', 'nullable': true  })
  priceWithVat: number;
  @Column({type: "int", default: 1, name: 'quantity', 'nullable': true  })
  quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems)
  @JoinColumn({name: 'order_id'})
  @Index("order-item-order-idx")
  order: Order

  @OneToMany(() => ToppingOrderItemEntity, (toppingItem) => toppingItem.orderItem)
  toppingsItems: ToppingItem[];

}
