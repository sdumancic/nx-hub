import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../../data-source';
import { logger } from '../../../util/logger';
import { RolePermissionEntity } from '../../../entities/role-permission';
import { PermissionEntity } from '../../../entities/permission';
import { RoleEntity } from "../../../entities/role";

export async function assignPermissionToRole(
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
    if (rolePermission) {
      const message = 'Permission is already assigned to role';
      response.status(500).json(message);
      return;
    }

    const newAssignment = repository.create({
      role: { id: Number(roleId) },
      permission: { id: Number(permissionId) },
    });
    await AppDataSource.manager.save(newAssignment);
    const found = await repository.find({
      where: {
        id: Number(newAssignment.id),
      },
      relations: {
        permission: true,
        role: true,
      },
    });

    response.status(201).json(found);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
