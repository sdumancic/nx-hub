import { Order } from './order.interface';

export interface PagedOrders {
  list: Order[];
  count: number;
  limit: number;
  offset: number;
}
