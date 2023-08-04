import { NextFunction, Request, Response } from "express";
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
    const meal = await repository.findOne({
      where:{id:Number(mealId)},
      relations: ['category']
    })

    if (!meal){
      const message = {
        message: 'Could not find meal with id ' + mealId
      }
      response.status(404).json(message)
      return;
    }
    response.status(200).json(meal);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
