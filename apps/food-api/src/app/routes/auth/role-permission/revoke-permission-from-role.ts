import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../../data-source';
import { logger } from '../../../util/logger';
import { RolePermissionEntity } from '../../../entities/role-permission';
import { PermissionEntity } from '../../../entities/permission';
import { RoleEntity } from "../../../entities/role";

export async function revokePermissionFromRole(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const roleId = request.params.roleId;
    const permissionId = request.params.permissionId;
    if (!roleId) {
      throw 'roleId is mandatory';
    }
    if (!permissionId) {
      throw 'permissionId is mandatory';
    }

    await AppDataSource.getRepository(PermissionEntity).findOneOrFail({
      where: {
        id: Number(permissionId)
      },
    });

    await AppDataSource.getRepository(RoleEntity).findOneOrFail({
      where: {
        id: Number(roleId)
      },
    });
    const repository = AppDataSource.getRepository(RolePermissionEntity);
    const rolePermission = await repository
      .createQueryBuilder('rolePermissions')
      .where(
        'rolePermissions.role.id = :roleId and rolePermissions.permission.id=:permissionId',
        {
          roleId,
          permissionId,
        }
      )
      .getOne();
    if (!rolePermission) {
      const message = 'Permission is not assigned to role';
      response.status(500).json(message);
      return;
    }
    await repository.delete({id: rolePermission.id })

    response.status(200).json("Permission revoked");
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
