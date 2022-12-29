import {DataSource} from 'typeorm';
import { CategoryEntity } from "../entities/category";
import { MealEntity } from "../entities/meal";
import { ToppingEntity } from "../entities/topping";
import { MealToppingEntity } from "../entities/meal-topping";
import { OrderEntity } from "../entities/order";
import { MealOrderItemEntity } from "../entities/meal-order-item";
import { ToppingOrderItemEntity } from "../entities/topping-order-item";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3456,
  database: process.env.DB_NAME,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  synchronize: true,
  entities: [CategoryEntity, MealEntity, ToppingEntity,MealToppingEntity, OrderEntity, MealOrderItemEntity, ToppingOrderItemEntity],
  logging: true,
});
