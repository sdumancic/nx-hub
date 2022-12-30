import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../../data-source';
import { logger } from '../../../util/logger';
import { RolePermissionEntity } from '../../../entities/role-permission';
import { PermissionEntity } from '../../../entities/permission';
import { RoleEntity } from "../../../entities/role";
import { UserEntity } from "../../../entities/user";
import { UserRoleEntity } from "../../../entities/user-role";

export async function assignRoleToUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const roleId = request.params.roleId;
    const userId = request.params.userId;
    if (!roleId) {
      throw 'roleId is mandatory';
    }
    if (!userId) {
      throw 'userId is mandatory';
    }

    await AppDataSource.getRepository(UserEntity).findOneOrFail({
      where: {
        id: Number(userId)
      },
    });

    await AppDataSource.getRepository(RoleEntity).findOneOrFail({
      where: {
        id: Number(roleId)
      },
    });
    const repository = AppDataSource.getRepository(UserRoleEntity);
    const userRole = await repository
      .createQueryBuilder('userRoles')
      .where(
        'userRoles.role.id = :roleId and userRoles.user.id=:userId',
        {
          roleId,
          userId,
        }
      )
      .getOne();
    if (userRole) {
      const message = 'Role is already assigned to user';
      response.status(500).json(message);
      return;
    }

    const newAssignment = repository.create({
      role: { id: Number(roleId) },
      user: { id: Number(userId) },
      dateAssigned: new Date()
    });
    await AppDataSource.manager.save(newAssignment);
    const found = await repository.find({
      where: {
        id: Number(newAssignment.id),
      },
      relations: {
        user: true,
        role: true,
      },
    });

    response.status(200).json(found);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
