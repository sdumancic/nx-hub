import { OrderItem, ToppingItem } from "@hub/shared/model/food-models";

export function calculateOrderTotal(orderItems: OrderItem[]):  {orderTotalNoVat: number, orderTotalWithVat: number} {
  if (!orderItems) {
    return {
      orderTotalNoVat: null,
      orderTotalWithVat: null
    }
  }
  let orderTotalWithVat = 0;
  orderItems.forEach((item: OrderItem) => {
    orderTotalWithVat =
      orderTotalWithVat + Number(item.meal.price) * Number(item.quantity);
    if (item.toppingsItems && item.toppingsItems.length > 0) {
      item.toppingsItems.forEach((toppingItem: ToppingItem) => {
        orderTotalWithVat =
          orderTotalWithVat + Number(toppingItem.toppingPriceForMeal) * Number(toppingItem.quantity);
      });
    }
  });
  const orderTotalNoVat = orderTotalWithVat / (1 + 25/100);
  return { orderTotalNoVat, orderTotalWithVat };
}

