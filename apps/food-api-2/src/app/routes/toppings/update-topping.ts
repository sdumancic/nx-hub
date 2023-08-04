import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";
import { ToppingEntity } from "../../entities/topping";

export async function updateTopping(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const toppingId = request.params.toppingId
    const changes = request.body;

    const { name, description,iconUrl } = request.body;

    if (!name) {
      throw {message:'name is mandatory'};
    }

    const repository = AppDataSource.getRepository(ToppingEntity);
    const topping = await repository
      .createQueryBuilder('topping')
      .where('name = :name and id != :toppingId', { name, toppingId})
      .getOne();
    if (topping) {
      const message = {message:'Topping with given name already exists on different ID'};
      response.status(400).json(message);
      return;
    }

    await AppDataSource
      .createQueryBuilder()
      .update(ToppingEntity)
      .set(changes)
      .where("id = :toppingId", {toppingId})
      .execute()

    const updatedTopping = await AppDataSource.getRepository(ToppingEntity)
      .findOneByOrFail({
        id: Number(toppingId)
      })

    logger.info('topping updated');
    response.status(201).json(updatedTopping);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
