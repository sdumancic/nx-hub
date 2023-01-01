import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";

export async function updateMeal(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const mealId = request.params.mealId
    const changes = request.body;

    const { calories, description,name,price,rating, category } = request.body;
    if (!category) {
      throw {message:'category is mandatory'};
    }
    if (!name) {
      throw {message:'name is mandatory'};
    }
    const foundCategory = await AppDataSource.getRepository(CategoryEntity)
      .findOneBy({
        id: Number(category.id)
      })
    if (!foundCategory){
      throw {message:'Category not found'};
    }
    const repository = AppDataSource.getRepository(MealEntity);
    const meal = await repository
      .createQueryBuilder('meal')
      .where('name = :name and id != :mealId', { name, mealId })
      .getOne();
    if (meal) {
      const message = {message:'Meal with given name already exists on different ID'};
      response.status(400).json(message);
      return;
    }

    await AppDataSource
      .createQueryBuilder()
      .update(MealEntity)
      .set(changes)
      .where("id = :mealId", {mealId})
      .execute()

    const updatedMeal = await AppDataSource.getRepository(MealEntity)
      .findOneByOrFail({
        id: Number(mealId)
      })

    logger.info('meal updated');
    response.status(201).json(updatedMeal);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
