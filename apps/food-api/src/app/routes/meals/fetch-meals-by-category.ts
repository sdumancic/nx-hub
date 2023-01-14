import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";
import { getInstrumentationExcludedPaths } from "@angular-devkit/build-angular/src/webpack/utils/helpers";
import { Like } from "typeorm";

export async function searchMealsByCategory(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {

    const categoryId = request.query.categoryId
    const limit= request.query.limit || 10
    const offset = request.query.offset || 0
    const name = request.query.name ?? ''

    const [list,count] = await AppDataSource.getRepository(MealEntity)
      .createQueryBuilder("meal")
      .innerJoinAndSelect(
        "meal.category",
        "category"
      )
      .where("meal.active = true and meal.category.id = :categoryId and (upper(meal.name) like :name or upper(meal.description) like :name)", { categoryId: categoryId, name: '%'+String(name).toUpperCase()+'%' })
      .orderBy("meal.id", "ASC")
      .take(Number(limit))
      .skip(Number(offset))
      .maxExecutionTime(3000)
      .getManyAndCount()

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
