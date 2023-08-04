import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { logger } from "../../../util/logger";
import { RoleEntity } from "../../../entities/role";
import { PermissionEntity } from "../../../entities/permission";

export async function createPermission(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { name, description } = request.body;
    if (!name) {
      throw {message:'name is mandatory'};
    }

    const repository = AppDataSource.getRepository(PermissionEntity);
    const permission = await repository
      .createQueryBuilder('permission')
      .where('name = :name', { name: name.toString().toUpperCase() })
      .getOne();
    if (permission) {
      const message = {message: 'Role with given name already exists'};
      response.status(400).json(message);
      return;
    }

    const newPermission = repository.create({ name: name.toString().toUpperCase(), description, active: true});
    await AppDataSource.manager.save(newPermission);
    response.status(201).json(newPermission);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
