import { NextFunction, Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { MealEntity } from "../../entities/meal";
import {Like} from "typeorm";

export async function fetchAllMeals(
  request: Request,
  response: Response,
  next: NextFunction
){
  try {

    const filters = request.query.filter;
    const page = request.query.page;
    const categoryId = filters ? filters['categoryId'] : null;
    const name = filters ? filters['name'] : null;
    const limit = page ? page['size'] : 10 || 10
    const pageNumber = page ? page['number'] : 0|| 0
    const offset = pageNumber * limit;
    const sort = request.query.sort
    const order = {};
    if (sort){
      const sortFields: string[] = sort.toString().split(',');
      for (let i = 0; i<sortFields.length; i++){
        if (sortFields[i][0] === '-') {
          const actualField = sortFields[i].substring(1);
          order[actualField] = 'DESC'
        }  else {
          order[sortFields[i]] = 'ASC'
        }
      }
    }

    const [list,count] = await AppDataSource.getRepository(MealEntity)
      .findAndCount({
        select: {
          id: true,
          name: true,
          rating: true,
          price: true,
          calories: true,
          description: true,
          createdAt: true,
          modifiedAt: true,
          imageUrl:true,
          category: {
            id: true,
            name: true,
          }
        },
        relations: ['category'],
        where: {
          active: true,
          category: {
            id: categoryId ? categoryId: null
          },
          name: name != null ? Like(`${name}%`) : Like('%')
        },
        order: order,
        skip: Number(offset),
        take: Number(limit)
      })


    response.status(200).json({
      list,
      count,
      limit,
      offset
    });
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
