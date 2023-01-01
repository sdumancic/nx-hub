import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { logger } from "../../../util/logger";
import { RoleEntity } from "../../../entities/role";
import { PermissionEntity } from "../../../entities/permission";

export async function deactivatePermission(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const permissionId = request.params.permissionId
    if (!permissionId) {
      throw {message: 'permissionId not set'};
    }

    const foundPermission = await AppDataSource.getRepository(PermissionEntity)
      .findOneBy({
        id: Number(permissionId)
      })
    if (!foundPermission){
      throw {message:'Permission not found'};
    }
    foundPermission.active = false;
    const repository = AppDataSource.getRepository(PermissionEntity);
    await AppDataSource
      .createQueryBuilder()
      .update(PermissionEntity)
      .set({ active: false })
      .where("id = :permissionId", {permissionId})
      .execute()

    response.status(200).json("Permission deactivated");
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
