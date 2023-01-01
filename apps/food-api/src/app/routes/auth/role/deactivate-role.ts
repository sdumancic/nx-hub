import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { logger } from "../../../util/logger";
import { RoleEntity } from "../../../entities/role";

export async function deactivateRole(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const roleId = request.params.roleId
    if (!roleId) {
      throw {message:'roleId not set'};
    }

    const foundRole = await AppDataSource.getRepository(RoleEntity)
      .findOneBy({
        id: Number(roleId)
      })
    if (!foundRole){
      response.status(200).json({message:'Role not found'});
    }
    foundRole.active = false;
    const repository = AppDataSource.getRepository(RoleEntity);
    await AppDataSource
      .createQueryBuilder()
      .update(RoleEntity)
      .set({ active: false })
      .where("id = :roleId", {roleId})
      .execute()

    response.status(200).json("Role deactivated");
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
