import { NextFunction, Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { CategoryEntity } from "../../entities/category";
import { logger } from "../../util/logger";

export async function fetchCategoryById(
  request: Request,
  response: Response,
  next: NextFunction
){
  try {

    const id = request.params.id;
    const category = await AppDataSource.getRepository(CategoryEntity)
      .findOneBy({
        id: Number(id)
      })

   if (!category){
      const message = {
       message: 'Could not find category with id ' + id
      }
      response.status(404).json(message)
      return;
    }

    response.status(200).json(category);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
