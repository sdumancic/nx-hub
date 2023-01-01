import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { OrderEntity } from "../../entities/order";
import { Between, Equal } from "typeorm";

export async function fetchOrders(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { status, datePlacedFrom, datePlacedTo } = request.query;
    const limit = request.query.limit || 10;
    const offset = request.query.offset || 0;

    let statusValue = null;
    let datePlacedFromValue = null;
    let datePlacedToValue = null;
    if (status){
      statusValue = status.toString()
    }
    if (datePlacedFrom){
      datePlacedFromValue = new Date(datePlacedFrom.toString())
    }
    if (datePlacedTo){
      datePlacedToValue = new Date(datePlacedTo.toString())
    }

    const [list, count] = await AppDataSource.getRepository(
      OrderEntity
    ).findAndCount({
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
        status: Equal(statusValue),
        datePlaced: Between(datePlacedFromValue,datePlacedToValue)
      },
      order: {
        id: 'ASC',
      },
      skip: Number(offset),
      take: Number(limit),
    });

    response.status(201).json({
      list,
      count,
      limit,
      offset,
    });
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
