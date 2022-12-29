import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";

export async function deactivateMeal(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const mealId = request.params.mealId
    if (!mealId) {
      throw 'mealId is mandatory';
    }

    const foundMeal = await AppDataSource.getRepository(MealEntity)
      .findOneByOrFail({
        id: Number(mealId)
      })
    if (!foundMeal){
      throw 'Meal not found';
    }
    foundMeal.active = false;
    const repository = AppDataSource.getRepository(MealEntity);
    await AppDataSource
      .createQueryBuilder()
      .update(MealEntity)
      .set({ active: false })
      .where("id = :mealId", {mealId})
      .execute()

    logger.info('new meal created');
    response.status(200).json("Meal deactivated");
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
