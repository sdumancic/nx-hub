import { OrderItem, ToppingItem } from "@hub/shared/model/food-models";

export function calculateOrderTotal(orderItems: OrderItem[]):  {orderTotalNoVat: number, orderTotalWithVat: number} {
  if (!orderItems) {
    return {
      orderTotalNoVat: null,
      orderTotalWithVat: null
    }
  }
  let orderTotalNoVat = 0;
  let orderTotalWithVat = 0;
  orderItems.forEach((item: OrderItem) => {
    orderTotalNoVat =
      orderTotalNoVat + Number(item.priceNoVat) * Number(item.quantity);
    orderTotalWithVat =
      orderTotalWithVat + Number(item.priceWithVat) * Number(item.quantity);
    if (item.toppingsItems && item.toppingsItems.length > 0) {
      item.toppingsItems.forEach((toppingItem: ToppingItem) => {
        orderTotalNoVat =
          orderTotalNoVat + Number(toppingItem.priceNoVat) * Number(toppingItem.quantity);
        orderTotalWithVat =
          orderTotalWithVat + Number(toppingItem.priceWithVat) * Number(toppingItem.quantity);
      });
    }
  });
  return { orderTotalNoVat, orderTotalWithVat };
}
