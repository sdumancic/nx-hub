import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { logger } from '../../util/logger';
import { OrderEntity } from '../../entities/order';
import { MealItem, ToppingItem } from '@hub/shared/model/food-models';
import { MealOrderItemEntity } from '../../entities/meal-order-item';
import { ToppingOrderItemEntity } from '../../entities/topping-order-item';
import { MealEntity } from "../../entities/meal";

export async function placeOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    const { deliveryAddress, deliveryCity, notes, deliveryLocation } = request.body;
    const mealItems: MealItem[] = request.body.mealItems;
    const toppingItems: ToppingItem[] = request.body.toppingItems;
    let { paymentMethod } = request.body;
    if (!paymentMethod) {
      paymentMethod = 'cash';
    }
    if (!deliveryAddress) {
      throw 'deliveryAddress is mandatory';
    }
    if (!deliveryCity) {
      throw 'deliveryCity is mandatory';
    }
    if (!mealItems) {
      throw 'mealItems is mandatory';
    }
    if (mealItems.length === 0) {
      throw 'orderItems is empty';
    }
    let orderTotalNoVat = 0;
    let orderTotalWithVat = 0;
    logger.info(mealItems.length);
    mealItems.forEach((item: MealItem) => {
      orderTotalNoVat =
        orderTotalNoVat + Number(item.priceNoVat) * Number(item.quantity);
      orderTotalWithVat =
        orderTotalWithVat + Number(item.priceWithVat) * Number(item.quantity);
    });
    logger.info(toppingItems?.length);
    toppingItems?.forEach((item: ToppingItem) => {
      orderTotalNoVat =
        orderTotalNoVat + Number(item.priceNoVat) * Number(item.quantity);
      orderTotalWithVat =
        orderTotalWithVat + Number(item.priceWithVat) * Number(item.quantity);
    });

    const orderRepo = AppDataSource.getRepository(OrderEntity);
    const mealsRepo = AppDataSource.getRepository(MealOrderItemEntity);
    const toppingsRepo = AppDataSource.getRepository(ToppingOrderItemEntity);

    await queryRunner.startTransaction();
    logger.info('1');
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
    logger.info('Saved order ' + order.id);

    for (const item of mealItems) {
      const mealItemEntity = mealsRepo.create({
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
      await queryRunner.manager.save(mealItemEntity);
    }

    if (toppingItems && toppingItems.length > 0) {
      for (const item of toppingItems) {
        const toppingItemEntity = toppingsRepo.create({
          quantity: item.quantity,
          priceNoVat: item.priceNoVat,
          priceWithVat: item.priceWithVat,
          topping: {
            id: item.topping.id,
          },
          order: {
            id: order.id,
          },
        });
        await queryRunner.manager.save(toppingItemEntity);
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
          mealItems: true,
          toppingItems: true
        }
      })

    response.status(201).json(fetchedOrder);
  } catch (error) {
    logger.error(error);
    await queryRunner.rollbackTransaction();
    return next(error);
  }
}
