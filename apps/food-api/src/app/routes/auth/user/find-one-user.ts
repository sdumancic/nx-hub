import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { logger } from "../../../util/logger";
import { UserEntity } from "../../../entities/user";

export async function findOneUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userId = request.params.userId
    const repository = AppDataSource.getRepository(UserEntity);
    const user = await repository.find({
      select: {
        id: true,
        active:true,
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
        id: Number(userId)
      },
      order: {
        id: 'ASC',
      },
    })


    response.status(200).json(user);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
