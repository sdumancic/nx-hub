import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";
import { getInstrumentationExcludedPaths } from "@angular-devkit/build-angular/src/webpack/utils/helpers";
import { MealToppingEntity } from "../../entities/meal-topping";

export async function fetchToppingsByMealId(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {

    const mealId = request.query.mealId
    const limit= request.query.limit || 10
    const offset = request.query.offset || 0

    const [list,count] = await AppDataSource.getRepository(MealToppingEntity)
      .findAndCount({
        select: {
          id: true,
          price: true,
          createdAt: true,
          modifiedAt: true,
          topping: {
            id: true,
            name: true,
            description: true
          }
        },
        relations: ['topping'],
        where: {
            active: true,
            meal: {
              id: Number(mealId)
            }
        },
        order: {
          id: 'ASC',
        },
        skip: Number(offset),
        take: Number(limit)
      })


    response.status(201).json({
      list,
      count,
      limit,
      offset
    });
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
