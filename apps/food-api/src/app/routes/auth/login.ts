import { NextFunction, Request, Response } from "express";
import { logger } from "../../util/logger";
import { AppDataSource } from "../data-source";
import { UserEntity } from "../../entities/user";
import { calculatePasswordHash } from "@hub/shared/util/core";
import jwt = require('jsonwebtoken')
import { environment } from "../../../environments/environment";
const JWT_SECRET = environment.jwt_secret

export async function loginUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const {email, password}  = request.body;
    if (!email){
      throw {message:"email not provided"}
    }
    if (!password){
      throw  {message:"password not provided"}
    }
    const repository = AppDataSource.getRepository(UserEntity);
    const user = await repository.findOneOrFail({
      select: {
        id: true,
        active:true,
        firstName: true,
        lastName: true,
        email: true,
        userRoles: true,
        passwordSalt: true,
        passwordHash: true
      },
      relations: ['userRoles', 'userRoles.role'],
      where: {
        email: String(email),
        active: true
      }
    })
    if (!user) {
      const message= "User does not exists or is not active";
      response
        .status(403)
        .json(message);
      return;
    }

    const hash = await calculatePasswordHash(password,user.passwordSalt)
    if (hash !== user.passwordHash){
      const message = `Login denied`;
      logger.info(`${message}- user with ${email} has entered wrong password`)
      response.status(403).json({message});
      return;
    }

    const authJwt = {
      userId: user.id,
      email: user.email,
      userRoles: user.userRoles,
      isAdmin: user.userRoles.find(userRole => userRole.role.id === 1) ? true: false
    }

    const token = jwt.sign(
      authJwt,
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    response.status(200).json({
      user: {
        email,
        isAdmin: user.userRoles.find(userRole => userRole.role.id === 1) ? true: false,
        userRoles: user.userRoles.map(userRole => {
          return {
            roleId: userRole.role.id,
            roleName: userRole.role.name
          }
        })
      },
      token
    })

  } catch (error) {
  logger.error(error);
  return next(error);
}
}
