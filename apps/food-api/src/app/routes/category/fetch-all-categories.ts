import { NextFunction, Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../../entities/category";
import { logger } from "../../util/logger";

export async function fetchAllCategories(
  request: Request,
  response: Response,
  next: NextFunction
){
  try {
    logger.debug("Called fetchAllCategories");
    const categories = await AppDataSource.getRepository(Category)
      .createQueryBuilder("categories")
      .orderBy("categories.id")
      .getMany();

    response.status(200).json({ categories });
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
