import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";
import { getInstrumentationExcludedPaths } from "@angular-devkit/build-angular/src/webpack/utils/helpers";
import { ToppingEntity } from "../../entities/topping";

export async function fetchToppings(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {

    const limit= request.query.limit || 10
    const offset = request.query.offset || 0

    const [list,count] = await AppDataSource.getRepository(ToppingEntity)
      .findAndCount({
        select: {
          id: true,
          name: true,
          description: true,
          iconUrl: true,
          createdAt: true,
          modifiedAt: true,
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
