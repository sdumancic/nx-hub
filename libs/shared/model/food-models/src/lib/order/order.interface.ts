import { OrderItem } from "./order-item.interface";
import { Customer } from "../customer/customer.interface";

export const ORDER_ID = 'id'
export const DATE_PLACED = 'datePlaced'
export const DATE_DISPATCHED = 'dateDispatched'
export const DATE_COMPLETED = 'dateCompleted'
export const NOTES = 'notes'
export const STATUS = 'status'
export const ORDER_TOTAL_NO_VAT = 'orderTotalNoVat'
export const ORDER_TOTAL_WITH_VAT = 'orderTotalWithVat'
export const DELIVERY_ADDRESS = 'deliveryAddress'
export const DELIVERY_CITY = 'deliveryCity'
export const DELIVERY_LOCATION = 'deliveryLocation'
export const PAYMENT_METHOD = 'paymentMethod'
export const CREATED_AT = 'createdAt'
export const MODIFIED_AT = 'modifiedAt'

export interface Order {
  id: number;
  datePlaced: Date;
  dateDispatched: Date;
  dateCompleted: Date;
  notes: string;
  status: string;
  orderTotalNoVat: number;
  orderTotalWithVat: number;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryLocation: any;
  paymentMethod: string;
  createdAt?: Date;
  modifiedAt?: Date;
  orderItems: OrderItem[];
  customer: Customer;
}
