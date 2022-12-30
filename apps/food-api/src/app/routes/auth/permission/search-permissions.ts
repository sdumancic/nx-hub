import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { logger } from "../../../util/logger";
import { RoleEntity } from "../../../entities/role";
import { MealEntity } from "../../../entities/meal";
import { PermissionEntity } from "../../../entities/permission";
import { Like } from "typeorm";

export async function searchPermissions(
  request: Request,
  response: Response,
  next: NextFunction
){
  try {
    const name = request.query.name
    const limit= request.query.limit || 10
    const offset = request.query.offset || 0

    const [list,count] = await AppDataSource.getRepository(PermissionEntity)
      .findAndCount({
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          modifiedAt: true,
        },
         where: {
          active: true,
          name: name ? Like(String(`${name}%`).toUpperCase()) : null
        },
        order: {
          id: 'ASC',
        },
        skip: Number(offset),
        take: Number(limit)
      })


    response.status(201).json({
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
