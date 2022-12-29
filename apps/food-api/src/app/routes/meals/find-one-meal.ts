import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";

export async function findOneMeal(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const mealId = request.params.mealId
    const repository = AppDataSource.getRepository(MealEntity);
    const meal = await repository.findOneBy({id:Number(mealId)})

    response.status(200).json(meal);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
