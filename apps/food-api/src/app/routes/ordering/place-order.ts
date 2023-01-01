import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { logger } from '../../util/logger';
import { OrderEntity } from '../../entities/order';
import { Order, OrderItem, ToppingItem } from "@hub/shared/model/food-models";
import { OrderItemEntity } from '../../entities/order-item';
import { ToppingOrderItemEntity } from '../../entities/topping-order-item';

export async function placeOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    const { deliveryAddress, deliveryCity, notes, deliveryLocation } = request.body;
    const orderItems: OrderItem[] = request.body.orderItems;

    let { paymentMethod } = request.body;
    if (!paymentMethod) {
      paymentMethod = 'cash';
    }
    if (!deliveryAddress) {
      throw {message:'deliveryAddress is mandatory'};
    }
    if (!deliveryCity) {
      throw {message:'deliveryCity is mandatory'};
    }
    if (!orderItems) {
      throw {message:'orderItems is mandatory'};
    }
    if (orderItems.length === 0) {
      throw {message:'orderItems is empty'};
    }
    let orderTotalNoVat = 0;
    let orderTotalWithVat = 0;

    orderItems.forEach((item: OrderItem) => {
      orderTotalNoVat =
        orderTotalNoVat + Number(item.priceNoVat) * Number(item.quantity);
      orderTotalWithVat =
        orderTotalWithVat + Number(item.priceWithVat) * Number(item.quantity);
      if (item.toppingsItems && item.toppingsItems.length > 0){
        item.toppingsItems.forEach((toppingItem: ToppingItem) => {
          orderTotalNoVat =
            orderTotalNoVat + Number(toppingItem.priceNoVat) * Number(toppingItem.quantity);
          orderTotalWithVat =
            orderTotalWithVat + Number(toppingItem.priceWithVat) * Number(toppingItem.quantity);
        })
      }
    });

    const orderRepo = AppDataSource.getRepository(OrderEntity);
    const orderItemsRepo = AppDataSource.getRepository(OrderItemEntity);
    const toppingsRepo = AppDataSource.getRepository(ToppingOrderItemEntity);

    await queryRunner.startTransaction();

    const order = orderRepo.create({
      datePlaced: new Date(),
      dateDispatched: null,
      dateCompleted: null,
      notes: notes,
      status: 'placed',
      orderTotalNoVat: orderTotalNoVat,
      orderTotalWithVat: orderTotalWithVat,
      deliveryAddress: deliveryAddress,
      deliveryCity: deliveryCity,
      deliveryLocation: deliveryLocation ?  deliveryLocation : null,
      paymentMethod: paymentMethod,
    });
    await queryRunner.manager.save(order);


    for (const item of orderItems) {

      const orderItemEntity = orderItemsRepo.create({
        quantity: item.quantity,
        priceNoVat: item.priceNoVat,
        priceWithVat: item.priceWithVat,
        meal: {
          id: item.meal.id,
        },
        order: {
          id: order.id,
        },
      });
      await queryRunner.manager.save(orderItemEntity);
      if (item.toppingsItems && item.toppingsItems.length > 0){
        for (const toppingItem of item.toppingsItems) {
          const toppingItemEntity = toppingsRepo.create({
            quantity: item.quantity,
            priceNoVat: item.priceNoVat,
            priceWithVat: item.priceWithVat,
            topping: {
              id: toppingItem.topping.id,
            },
            orderItem: {
              id: orderItemEntity.id,
            },
          });
          await queryRunner.manager.save(toppingItemEntity);
        }
      }
    }



    await queryRunner.commitTransaction();
    await queryRunner.release();

    const fetchedOrder = await AppDataSource.getRepository(OrderEntity)
      .find({
        where:{
          id: Number(order.id)
        },
        relations: {
          orderItems: {
            toppingsItems: true,
            meal: true
          }
        }
      })

    response.status(201).json(fetchedOrder);
  } catch (error) {
    logger.error(error);
    await queryRunner.rollbackTransaction();
    return next(error);
  }
}
