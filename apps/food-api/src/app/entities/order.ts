import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItem, Order } from "@hub/shared/model/food-models";
import { OrderItemEntity } from "./order-item";

@Entity({
  name: 'order'
})
export class OrderEntity implements Order {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({name:'date_placed'})
  datePlaced: Date;
  @Column({nullable: true,name: 'date_dispatched'})
  dateDispatched: Date;
  @Column({nullable: true,name: 'date_completed'})
  dateCompleted: Date;
  @Column({name: 'status'})
  status: string;
  @Column({name: 'payment_method'})
  paymentMethod: string;
  @Column({type: "decimal", precision: 10, scale: 2, default: 0, name: 'order_total_no_vat'})
  orderTotalNoVat: number;
  @Column({type: "decimal", precision: 10, scale: 2, default: 0, name: 'order_total_with_vat'})
  orderTotalWithVat: number;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'modified_at'})
  modifiedAt: Date

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    srid: 4326,
    nullable: true,
    spatialFeatureType: 'Point',
    name:'delivery_location'
  })
  deliveryLocation:string

  @Column({name: 'delivery_address'})
  deliveryAddress: string;
  @Column({name: 'delivery_city'})
  deliveryCity: string;
  @Column({name: 'notes'})
  notes: string;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: OrderItem[]

}
