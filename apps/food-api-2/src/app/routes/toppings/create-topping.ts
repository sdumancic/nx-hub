import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { ToppingEntity } from "../../entities/topping";

export async function createTopping(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, iconUrl, description } = request.body;
    if (!name) {
      throw {message:'name is mandatory'};
    }

    const repository = AppDataSource.getRepository(ToppingEntity);
    const topping = await repository
      .createQueryBuilder('topping')
      .where('name = :name', { name })
      .getOne();
    if (topping) {
      const message = {message:'Topping with given name already exists'};
      response.status(400).json(message);
      return;
    }

    const newTopping = repository.create({ name, description, iconUrl, active: true});
    await AppDataSource.manager.save(newTopping);
    logger.info('new topping created');
    response.status(201).json(newTopping);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
