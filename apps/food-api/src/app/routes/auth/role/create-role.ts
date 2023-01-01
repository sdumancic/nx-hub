import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { logger } from "../../../util/logger";
import { RoleEntity } from "../../../entities/role";

export async function createRole(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, description } = request.body;
    if (!name) {
      throw {message:'name is mandatory'};
    }

    const repository = AppDataSource.getRepository(RoleEntity);
    const role = await repository
      .createQueryBuilder('role')
      .where('name = :name', { name })
      .getOne();
    if (role) {
      const message = {message:'Role with given name already exists'};
      response.status(400).json(message);
      return;
    }

    const newRole = repository.create({ name, description, active: true});
    await AppDataSource.manager.save(newRole);
    response.status(201).json(newRole);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
