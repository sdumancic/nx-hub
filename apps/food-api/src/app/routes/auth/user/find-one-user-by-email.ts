import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { logger } from "../../../util/logger";
import { UserEntity } from "../../../entities/user";

export async function findOneUserByEmail(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const email = request.query.email

    const repository = AppDataSource.getRepository(UserEntity);
    const user = await repository.findOneOrFail({
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
        email: String(email)
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
