import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Customer } from "@hub/shared/model/food-models";


@Entity({
  name: 'customer',
})
export class CustomerEntity implements Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', 'nullable': true  })
  firstName: string;

  @Column({ nullable: true, name: 'last_name' })
  lastName: string;

  @Column({ name: 'city', 'nullable': true  })
  city: string;

  @Column({ nullable: true, name: 'address' })
  address: string;


  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'modified_at', nullable: true })
  modifiedAt: Date;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    srid: 4326,
    nullable: true,
    spatialFeatureType: 'Point',
    name: 'delivery_location',
  })
  customerLocation: string;
}
