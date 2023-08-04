import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { logger } from "../../../util/logger";
import { RoleEntity } from "../../../entities/role";

export async function fetchAllRoles(
  request: Request,
  response: Response,
  next: NextFunction
){
  try {
    const roles = await AppDataSource.getRepository(RoleEntity)
      .createQueryBuilder("roles")
      .orderBy("roles.id")
      .getMany();

    response.status(200).json({ roles });
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
