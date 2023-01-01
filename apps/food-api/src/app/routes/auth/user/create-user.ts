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
      throw {message:'email is mandatory'};
    }
    if (!password) {
      throw {message:'password is mandatory'};
    }
    if (!address) {
      throw {message:'password is mandatory'};
    }
    if (!firstName) {
      throw {message:'firstName is mandatory'};
    }
    if (!lastName) {
      throw {message:'lastName is mandatory'};
    }

    const repository = AppDataSource.getRepository(UserEntity);
    const user = await repository
      .createQueryBuilder("users")
      .where("email = :email", { email })
      .getOne();
    if (user) {
      const message= {message:"User with given email already exists"};
      response
        .status(400)
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
