import { NextFunction, Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../../entities/category";
import { logger } from "../../util/logger";

export async function fetchCategoryById(
  request: Request,
  response: Response,
  next: NextFunction
){
  try {
    logger.debug("Called fetchCategoryById");
    const id = request.params.id;
    const category = await AppDataSource.getRepository(Category)
      .findOneByOrFail({
        id: Number(id)
      })

   /* if (!category){
      const message = 'Could not find category with name ' + categoryName
      logger.error(message)
      response.status(404).json(message)
      return;
    } */

    response.status(200).json(category);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
