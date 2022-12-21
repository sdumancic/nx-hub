import { NextFunction, Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../../entities/category";
import { logger } from "../../util/logger";

export async function searchCategoryByName(
  request: Request,
  response: Response,
  next: NextFunction
){
  try {
    logger.debug("Called searchCategoryByName");
    const categoryName = request.query.name

    const category = await AppDataSource.getRepository(Category)
      .findOneBy({
        name: categoryName.toString()
      })

    if (!category){
      const message = 'Could not find category with name ' + categoryName
      logger.error(message)
      response.status(404).json(message)
      return;
    }

    response.status(200).json(category);

    response.status(200).json(null);
  } catch (error) {
    logger.error(error);
    return next(error);
  }


}