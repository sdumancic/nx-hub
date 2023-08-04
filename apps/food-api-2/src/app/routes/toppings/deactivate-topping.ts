import { NextFunction, Request, Response } from 'express';
import { CategoryEntity } from '../../entities/category';
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";
import { ToppingEntity } from "../../entities/topping";

export async function deactivateTopping(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const toppingId = request.params.toppingId
    if (!toppingId) {
      throw {message:'toppingId is mandatory'};
    }

    const foundTopping = await AppDataSource.getRepository(ToppingEntity)
      .findOneByOrFail({
        id: Number(toppingId)
      })
    if (!foundTopping){
      throw {message: 'Topping not found'};
    }

    await AppDataSource
      .createQueryBuilder()
      .update(ToppingEntity)
      .set({ active: false })
      .where("id = :toppingId", {toppingId})
      .execute()

    response.status(200).json("Topping deactivated");
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
