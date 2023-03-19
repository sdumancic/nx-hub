import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CustomerEntity } from "../../entities/customer";
import { OrderEntity } from "../../entities/order";
import { OrderItemEntity } from "../../entities/order-item";
import { ToppingOrderItemEntity } from "../../entities/topping-order-item";
import { logger } from "../../util/logger";
import { calculateOrderTotal } from "../../util/calculate-order-total";


export async function updateOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    const orderId = request.params.orderId;
    const {
      paymentMethod,
      deliveryLocation,
      deliveryAddress,
      deliveryCity,
      notes,
      orderItems,
      customer
    } = request.body;
    await checkOrderExists(orderId);
    await checkCustomerExists(customer);

    const { orderTotalNoVat, orderTotalWithVat } = calculateOrderTotal(orderItems);
    await AppDataSource.manager.transaction(async (transactionalEntityManager) => {

      await transactionalEntityManager
        .createQueryBuilder()
        .update(OrderEntity)
        .set({
          notes: notes ? notes: null,
          orderTotalNoVat: orderTotalNoVat ? orderTotalNoVat : null,
          orderTotalWithVat: orderTotalWithVat ? orderTotalWithVat : null,
          deliveryAddress: deliveryAddress ? deliveryAddress : null,
          deliveryCity: deliveryCity ?  deliveryCity : null,
          deliveryLocation: deliveryLocation ? deliveryLocation : null,
          paymentMethod: paymentMethod ? paymentMethod: null,
          customer: customer ? customer : null
        })
        .where("id = :orderId", {orderId})
        .execute();

      if (orderItems) {
        const existingOrderItems = await transactionalEntityManager.find(OrderItemEntity,{
          where: { order: { id: Number(orderId) } }
        });

        existingOrderItems.forEach(orderItem => {
          transactionalEntityManager.delete(ToppingOrderItemEntity,{ orderItem: { id: Number(orderItem.id) } });
          transactionalEntityManager.delete(OrderItemEntity,{id: orderItem.id});

        });

        for (const item of orderItems) {
          const orderItemEntity = transactionalEntityManager.create(OrderItemEntity,{
            quantity: item.quantity,
            priceNoVat: item.priceNoVat,
            priceWithVat: item.priceWithVat,
            meal: {
              id: item.meal.id
            },
            order: {
              id: Number(orderId)
            }
          });
          await queryRunner.manager.save(orderItemEntity);
          if (item.toppingsItems && item.toppingsItems.length > 0) {
            for (const toppingItem of item.toppingsItems) {
              const toppingItemEntity = transactionalEntityManager.create(ToppingOrderItemEntity,{
                quantity: item.quantity,
                priceNoVat: item.priceNoVat,
                priceWithVat: item.priceWithVat,
                topping: {
                  id: toppingItem.topping.id
                },
                orderItem: {
                  id: orderItemEntity.id
                }
              });
              await queryRunner.manager.save(toppingItemEntity);
            }
          }
        }
      }
      const fetchedOrder = await transactionalEntityManager.getRepository(OrderEntity)
        .find({
          where: {
            id: Number(orderId)
          },
          relations: {
            customer: false,
            orderItems: {
              toppingsItems: true,
              meal: true
            }
          }
        });
      response.status(201).json(fetchedOrder);
    });

  } catch (error) {
    logger.error(error);
    return next(error);
  }
}


async function checkOrderExists(orderId: string){
  const foundOrder = await AppDataSource.getRepository(
    OrderEntity
  ).findOneBy({
    id: Number(orderId)
  });
  if (!foundOrder) {
    throw { message: "Order not found" };
  }
  if (foundOrder.status !== "placed") {
    throw { message: "Only orders with status \"placed\" can be updated" };
  }
}

async function checkCustomerExists(customer){
  if (customer != null) {
    const foundCustomer = await AppDataSource.getRepository(
      CustomerEntity
    ).findOneBy({
      id: Number(customer.id)
    });
    if (!foundCustomer) {
      throw { message: "Customer not found" };
    }
  }
}
