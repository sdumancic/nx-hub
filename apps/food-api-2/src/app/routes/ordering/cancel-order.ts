import { NextFunction, Request, Response } from "express";
import { logger } from "../../util/logger";
import { AppDataSource } from "../data-source";
import { OrderEntity } from "../../entities/order";

export async function cancelOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const orderId = request.params.orderId;
    const foundOrder = await AppDataSource.getRepository(
      OrderEntity
    ).findOneBy({
      id: Number(orderId),
    });
    if (!foundOrder) {
      throw {message:'Order not found'};
    }

    await AppDataSource
      .createQueryBuilder()
      .update(OrderEntity)
      .set({
        status: 'canceled'
      })
      .where("id = :orderId", {orderId})
      .execute()

    const updatedOrder = await AppDataSource.getRepository(OrderEntity)
      .findOneByOrFail({
        id: Number(orderId)
      })

    response.status(201).json(updatedOrder);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
