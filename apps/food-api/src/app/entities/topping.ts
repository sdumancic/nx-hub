import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Topping } from '@hub/shared/model/food-models';
import { MealToppingEntity } from "./meal-topping";
import { MealOrderItemEntity } from "./meal-order-item";
import { ToppingOrderItemEntity } from "./topping-order-item";

@Entity({
  name: 'topping',
})
export class ToppingEntity implements Topping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'name'})
  @Index({ unique: true })
  name: string;

  @Column({name: 'description', nullable: true})
  description: string;

  @Column({name: 'icon_url', nullable: true})
  iconUrl: string;

  @Column({name: 'active'})
  active: boolean;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'modified_at'})
  modifiedAt: Date;

  @OneToMany(() => MealToppingEntity, mealTopping => mealTopping.topping)
  public mealToppings!: MealToppingEntity[];

  @OneToMany(() => ToppingOrderItemEntity, (toppingItem) => toppingItem.topping)
  toppings: ToppingOrderItemEntity[]
}
