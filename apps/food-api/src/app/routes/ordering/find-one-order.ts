import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";
import { OrderEntity } from "../../entities/order";
import { Between, Equal } from "typeorm";

export async function findOneOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const orderId = request.params.orderId
    const repository = AppDataSource.getRepository(OrderEntity);
    const order = await repository.find({
      select: {
        id: true,
        datePlaced: true,
        dateDispatched: true,
        dateCompleted: true,
        status: true,
        paymentMethod: true,
        orderTotalNoVat: true,
        orderTotalWithVat: true,
        deliveryLocation: true,
        deliveryAddress: true,
        deliveryCity: true,
        notes: true,
        createdAt: true,
        modifiedAt: true,
        orderItems: true
      },
      relations: ['orderItems','orderItems.toppingsItems','orderItems.meal'],
      where: {
        id: Equal(Number(orderId))
      },
    })

    response.status(200).json(order);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
