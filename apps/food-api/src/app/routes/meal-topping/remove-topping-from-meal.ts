import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";
import { MealToppingEntity } from "../../entities/meal-topping";

export async function removeToppingFromMeal(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { toppingId, mealId } = request.body;
    if (!toppingId) {
      throw {message:'toppingId is mandatory'};
    }
    if (!mealId) {
      throw {message:'mealId is mandatory'};
    }

    const foundAssignment = await AppDataSource.getRepository(MealToppingEntity)
      .findOneBy({
        toppingId: Number(toppingId),
        mealId: Number(mealId)
      })

    if (foundAssignment){
      await AppDataSource.getRepository(MealToppingEntity).delete({
        id: foundAssignment.id
      });
      response.status(200).json("Meal deactivated");
    } else {
      response.status(200).json("No changes");
    }

  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
