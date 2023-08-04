import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";
import { MealToppingEntity } from "../../entities/meal-topping";

export async function assignToppingToMeal(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { toppingId, mealId, price } = request.body;
    if (!toppingId) {
      throw {message:'toppingId is mandatory'};
    }
    if (!mealId) {
      throw {message:'mealId is mandatory'};
    }
    if (!price) {
      throw {message:'price is mandatory'};
    }
    const foundAssignment = await AppDataSource.getRepository(MealToppingEntity)
      .findOneBy({
        toppingId: Number(toppingId),
        mealId: Number(mealId)
      })


    if (foundAssignment){
      const id = foundAssignment.id;
      await AppDataSource
        .createQueryBuilder()
        .update(MealToppingEntity)
        .set({
          price
        })
        .where("id = :id", {id})
        .execute()

      const updatedMealTopping = await AppDataSource.getRepository(MealToppingEntity)
        .findOneByOrFail({
          id: Number(id)
        })
      response.status(200).json(updatedMealTopping);
      return;
    }

    const repository = AppDataSource.getRepository(MealToppingEntity);
    const newMealTopping = repository.create({ mealId, toppingId, price, active: true});
    await AppDataSource.manager.save(newMealTopping);
    logger.info('meal topping assigned');
    response.status(201).json(newMealTopping);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
