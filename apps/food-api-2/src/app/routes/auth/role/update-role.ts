import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { logger } from "../../../util/logger";
import { RoleEntity } from "../../../entities/role";

export async function updateRole(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const roleId = request.params.roleId
    const changes = request.body;

    const { name, description } = request.body;

    const repository = AppDataSource.getRepository(RoleEntity);
    const role = await repository
      .createQueryBuilder('role')
      .where('name = :name and id != :roleId', { name, roleId })
      .getOne();
    if (role) {
      const message = {message:'Role with given name already exists on different ID'};
      response.status(400).json(message);
      return;
    }

    await AppDataSource
      .createQueryBuilder()
      .update(RoleEntity)
      .set(changes)
      .where("id = :roleId", {roleId})
      .execute()

    const updatedRole = await AppDataSource.getRepository(RoleEntity)
      .findOneByOrFail({
        id: Number(roleId)
      })


    response.status(201).json(updatedRole);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
