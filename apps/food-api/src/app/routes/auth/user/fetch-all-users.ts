import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { logger } from "../../../util/logger";
import { UserEntity } from "../../../entities/user";

export async function fetchAllUsers(
  request: Request,
  response: Response,
  next: NextFunction
){
  try {
    const limit = request.query.limit || 10
    const offset = request.query.offset || 0

    const [list,count] = await AppDataSource.getRepository(UserEntity)
      .findAndCount({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          address: true,
          city: true,
          state: true,
          pictureUrl: true,
          createdAt: true,
          modifiedAt: true,
          userRoles: true
        },
        relations: ['userRoles'],
        where: {
          active: true,
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
