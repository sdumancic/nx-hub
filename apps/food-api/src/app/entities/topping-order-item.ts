import {
  Column,
  CreateDateColumn,
  Entity, Index, JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Meal, MealItem, Order, Topping, ToppingItem } from "@hub/shared/model/food-models";
import { MealEntity } from "./meal";
import { OrderEntity } from "./order";
import { ToppingEntity } from "./topping";

@Entity({
  name: 'topping_order_item'
})
export class ToppingOrderItemEntity implements ToppingItem {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({name:'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name:'modified_at'})
  modifiedAt: Date
  @ManyToOne(() => ToppingEntity, (topping) => topping.toppings)
  @JoinColumn({name: 'topping_id'})
  @Index("topping-item-topping-idx")
  topping: Topping;
  @Column({type: "decimal", precision: 10, scale: 2, default: 0, name: 'price_no_vat'})
  priceNoVat: number;
  @Column({type: "decimal", precision: 10, scale: 2, default: 0, name: 'price_with_vat'})
  priceWithVat: number;
  @Column({type: "int", default: 1, name: 'quantity'})
  quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.toppingItems)
  @JoinColumn({name: 'order_id'})
  @Index("topping-item-order-idx")
  order: Order

}
