import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";
import { getInstrumentationExcludedPaths } from "@angular-devkit/build-angular/src/webpack/utils/helpers";

export async function searchMealsByCategory(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {

    const categoryId = request.query.categoryId
    const limit= request.query.limit || 10
    const offset = request.query.offset || 0

    const [list,count] = await AppDataSource.getRepository(MealEntity)
      .findAndCount({
        select: {
          id: true,
          name: true,
          calories: true,
          description: true,
          imageUrl: true,
          price: true,
          rating: true,
          createdAt: true,
          modifiedAt: true,
          category: {
            id: true,
            name: true
          }
        },
        relations: ['category'],
        where: {
            active: true,
            category: {
              id: Number(categoryId)
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
