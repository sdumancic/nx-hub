import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { logger } from "../../../util/logger";
import { UserEntity } from "../../../entities/user";
import crypto = require("crypto")
import { calculatePasswordHash } from "@hub/shared/util/core";

export async function createUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const {email, firstName, lastName, address, city, state, password, pictureUrl}  = request.body;
    if (!email) {
      throw 'email is mandatory';
    }
    if (!password) {
      throw 'password is mandatory';
    }
    if (!address) {
      throw 'password is mandatory';
    }
    if (!firstName) {
      throw 'firstName is mandatory';
    }
    if (!lastName) {
      throw 'lastName is mandatory';
    }

    const repository = AppDataSource.getRepository(UserEntity);
    const user = await repository
      .createQueryBuilder("users")
      .where("email = :email", { email })
      .getOne();
    if (user) {
      const message= "User with given email already exists, aborting";
      response
        .status(500)
        .json(message);
      return;
    }

    const passwordSalt = crypto.randomBytes(64).toString("hex");
    const passwordHash = await calculatePasswordHash(password, passwordSalt);
    const newUser = repository.create({email, firstName, lastName, address, city, state, pictureUrl, passwordHash, passwordSalt});
    await AppDataSource.manager.save(newUser);
    logger.info('new user created');

    response.status(201).json(newUser);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
