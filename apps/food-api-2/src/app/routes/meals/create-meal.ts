import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";

export async function createMeal(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
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
      .where('name = :name', { name })
      .getOne();
    if (meal) {
      const message = {message:'Meal with given name already exists'};
      response.status(400).json(message);
      return;
    }

    const newMeal = repository.create({ calories, description,name,price,rating, category , active: true});
    await AppDataSource.manager.save(newMeal);
    logger.info('new meal created');
    response.status(201).json(newMeal);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
