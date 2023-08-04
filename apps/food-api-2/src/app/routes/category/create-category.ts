import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";

export async function createCategory(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, iconUrl } = request.body;
    if (!name) {
      throw {message:'name is mandatory'};
    }
    if (!iconUrl) {
      throw {message: 'iconUrl is mandatory'};
    }
    const repository = AppDataSource.getRepository(CategoryEntity);
    const category = await repository
      .createQueryBuilder('category')
      .where('name = :name', { name })
      .getOne();
    if (category) {
      const message = 'Category with given name already exists, aborting';
      response.status(500).json(message);
      return;
    }

    const newCategory = repository.create({ name, iconUrl, active: true});
    await AppDataSource.manager.save(newCategory);
    logger.info('new category created');
    response.status(201).json(newCategory);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
