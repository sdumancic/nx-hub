import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { logger } from "../../../util/logger";
import { RoleEntity } from "../../../entities/role";
import { PermissionEntity } from "../../../entities/permission";

export async function updatePermission(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const permissionId = request.params.permissionId
    const { name, description } = request.body;

    const repository = AppDataSource.getRepository(PermissionEntity);
    const permission = await repository
      .createQueryBuilder('permission')
      .where('name = :name and id != :permissionId', { name, permissionId })
      .getOne();
    if (permission) {
      const message = 'permission with given name already exists on different ID';
      response.status(500).json(message);
      return;
    }

    await AppDataSource
      .createQueryBuilder()
      .update(PermissionEntity)
      .set({ name, description })
      .where("id = :permissionId", {permissionId})
      .execute()

    const updatedPermission = await AppDataSource.getRepository(PermissionEntity)
      .findOneByOrFail({
        id: Number(permissionId)
      })


    response.status(201).json(updatedPermission);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
