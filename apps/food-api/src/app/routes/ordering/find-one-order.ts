import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";
import { OrderEntity } from "../../entities/order";
import { Between, Equal } from "typeorm";
import { getInstrumentationExcludedPaths } from "@angular-devkit/build-angular/src/webpack/utils/helpers";
import { Meal, Order, Topping, ToppingItem } from "@hub/shared/model/food-models";

export async function findOneOrder(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const orderId = request.params.orderId
    const repository = AppDataSource.getRepository(OrderEntity);
    const order = await repository.findOne({
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
        customer: {
          id: true,
          firstName: true,
          lastName: true
        },
        orderItems: {
          id: true,
          priceNoVat: true,
          priceWithVat: true,
          quantity: true,
          toppingsItems: {
            id: true,
            quantity: true,
            priceNoVat: true,
            priceWithVat: true,
            topping: {
              id: true,
              name: true
            }
          }
        }
      },
      relations: ['customer','orderItems','orderItems.toppingsItems','orderItems.meal','orderItems.toppingsItems.topping'],
      where: {
        id: Equal(Number(orderId))
      },
    })

    if (!order){
      const message = {
        message: 'Could not find order with id ' + orderId
      }
      response.status(404).json(message)
      return;
    }

    response.status(200).json(order);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
