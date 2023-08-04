import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { logger } from "../../../util/logger";
import { UserEntity } from "../../../entities/user";
import crypto = require("crypto")
import { calculatePasswordHash } from "@hub/shared/util/core";
import { MealEntity } from "../../../entities/meal";

export async function changePassword(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userId = request.params.userId

    const {password}  = request.body;
    if (!password) {
      throw {message:'password is mandatory'};
    }

    const repository = AppDataSource.getRepository(UserEntity);
    const user = await repository
      .createQueryBuilder("users")
      .where("id = :userId", { userId })
      .getOne();
    if (!user) {
      const message= {message:"User with given ID does not exist"};
      response
        .status(400)
        .json(message);
      return;
    }

    const passwordSalt = crypto.randomBytes(64).toString("hex");
    const passwordHash = await calculatePasswordHash(password, passwordSalt);

    await AppDataSource
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        passwordHash,
        passwordSalt
      })
      .where("id = :userId", {userId})
      .execute()

    const updatedUser = await AppDataSource.getRepository(UserEntity)
      .findOneByOrFail({
        id: Number(userId)
      })

    response.status(200).json(updatedUser);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
